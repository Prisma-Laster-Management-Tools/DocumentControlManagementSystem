import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { uploadMultiplePhoto } from 'src/utilities/fs/image-upload';
import { calculateDayPassed, isAlreadyPassedPeriodOfDay } from 'src/utilities/time';
import { CalibrationEvidenceRepository } from './calibration-evidence.repository';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';
import { CreateCalibrationEvidenceDTO } from './dto/create-calibration-evidence.dto';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';

@Injectable()
export class CalibrationService {
  constructor(
    @InjectRepository(CalibrationScheduleRepository) private calibrationScheduleRepository: CalibrationScheduleRepository,
    @InjectRepository(CalibrationEvidenceRepository) private calibrationEvidenceRepository: CalibrationEvidenceRepository,
    private notificationService: NotificationService,
  ) {}

  async getAllCalibrationSchedules() {
    return await this.calibrationScheduleRepository
      .createQueryBuilder('calib_schedule')
      .leftJoinAndSelect('calib_schedule.calibration_evidence', 'calib_evidence')
      .orderBy('calib_evidence."createdAt"', 'DESC') // latest  first
      .getMany();
  }

  async createCalibrationSchedule(createCalibrationCycleDTO: CreateCalibrationCycleDTO) {
    return this.calibrationScheduleRepository.createCalibrationSchedule(createCalibrationCycleDTO);
  }

  async removeCalibrationSchedule(id: number) {
    const removal = await this.calibrationScheduleRepository.delete(id);
    if (!removal.affected) throw new NotFoundException(`CalibrationCycle of id "${id}" doesn't exist`);
    return removal;
  }

  //
  // ─── EVIDENCE ───────────────────────────────────────────────────────────────────
  //
  async gelAllCalibrationEvidence() {
    return await this.calibrationEvidenceRepository.find();
  }
  async getCalibrationEvidenceHistoryOfSpecificSerialNumber(serial_number: string) {
    return await this.calibrationEvidenceRepository.find({ where: { serial_number }, order: { createdAt: 'DESC' } });
  }
  async createCalibrationEvidence(createCalibrationEvidenceDTO: CreateCalibrationEvidenceDTO, files: Array<Express.Multer.File>) {
    const upload = uploadMultiplePhoto(files);
    const attachments = (upload.stored_path as Array<string>).join(',spiltter-23564,');

    const onEvidenceUploadCompletion = async () => {
      const cycle = await this.calibrationScheduleRepository.findOne({ serial_number: createCalibrationEvidenceDTO.serial_number });
      if (!cycle) return; // don't do anythings
      // if found -> stamp cycle_start_at -> to the cooldown one
      //cycle.cycle_start_at = cycle.cycle_start_at_for_notification_cooldown;
      cycle.cycle_start_at = new Date(Date.now());
      cycle.cycle_start_at_for_notification_cooldown = new Date(Date.now());
      await cycle.save();
    };

    return this.calibrationEvidenceRepository.createCalibrationEvidence(createCalibrationEvidenceDTO, attachments, onEvidenceUploadCompletion);
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── SCHEDULE TASK ──────────────────────────────────────────────────────────────
  //
  @Cron('30 * * * * *')
  async handleCron() {
    function convert_cycle_type_to_day(dtype: 'd' | 'm' | 'y') {
      if (dtype === 'd') return 1;
      else if (dtype === 'm') return 30;
      else if (dtype === 'y') return 365;
      else null;
    }

    //console.log('CRON EVERY 30 SEC TRIGGERED');
    const maintenance_lists = await this.getAllCalibrationSchedules();
    //const target = maintenance_lists[0] as Maintenance; // target only 1 item first for testing
    const today = new Date(Date.now());
    /*const cycle_start = new Date('2021-05-01 01:54:54.412');
    const day_passed = calculateDayPassed(cycle_start, today);*/

    // MAIN CORE
    for (let target of maintenance_lists) {
      //console.log(target.cycle_start_at);
      const { cycle_info, machine_name, id, serial_number, instruction, cycle_start_at_for_notification_cooldown, cycle_start_at: cycle_start_at_pure } = target; // don't use pure cycle_start_at []
      let cycle_start_at;
      if (cycle_start_at_for_notification_cooldown === null) {
        cycle_start_at = cycle_start_at_pure;
      } else {
        cycle_start_at = cycle_start_at_for_notification_cooldown;
      }

      //const cycle_start = new Date(cycle_start_at);
      const day_passed = calculateDayPassed(cycle_start_at, today);
      //console.log(`day passed for ${machine_name} is ${day_passed}`); // DEBUG ONLY

      let every_as_cycle_Regex = new RegExp('(every_)(\\d+)_([dmy])'); // atlease 1 length of digit [note to myself]
      let once_of_as_cycle_Regex = new RegExp('(once_of_)(\\d+)_([dmy])');
      if (every_as_cycle_Regex.test(cycle_info)) {
        const suffix_cycle_type = cycle_info[cycle_info.length - 1];
        const added_amount_for_completion: number = convert_cycle_type_to_day(suffix_cycle_type as 'd' | 'm' | 'y');
        //console.log('found as a every cycle');// DEBUG ONLY
        if (!added_amount_for_completion) continue; //console.log('found invalid cycle_info -> supported [d,m,y]'); // invalid format
        const [full_str, _, num_as_string, __] = every_as_cycle_Regex.exec(cycle_info);
        const multiply_amount = parseInt(num_as_string);
        if (!multiply_amount) continue; //console.log('found invalid multiply amount type -> supported only number');
        const comparison_target_day = added_amount_for_completion * multiply_amount;
        //console.log(comparison_target_day);// DEBUG ONLY
        const hit_period = isAlreadyPassedPeriodOfDay(day_passed, comparison_target_day);
        if (!hit_period) continue; //return; // doesn't hit the period yet
        //console.log(`[TODO]: Cycle -> ${machine_name} hit cycle of "${cycle_info} => Pushing to notification"`); // DEBUG ONLY
        //TODO Pushing to notification and stamp the current date for it
        const creation = await this.notificationService.createNotification({
          related_positions: null,
          message: `กรุณาตรวจสอบเครื่องตรวจวัด ${machine_name} เนื่องจากถึงรอบบำรุงรักษาแล้ว`,
          attached_params: `calibration:${id}:${machine_name}:${serial_number}:${instruction}`,
        });
        if (creation) {
          // if success
          //stamp the new date
          target.cycle_start_at_for_notification_cooldown = new Date(Date.now());
          target.save().catch(() => console.log('[ERROR]: Cannot stamp the new date for calibration schedule id ' + id));
        }
      } else if (once_of_as_cycle_Regex.test(cycle_info)) {
        const suffix_cycle_type = cycle_info[cycle_info.length - 1];
        const added_amount_for_completion: number = convert_cycle_type_to_day(suffix_cycle_type as 'd' | 'm' | 'y');
        //console.log('found as a once of cycle');// DEBUG ONLY
        if (!added_amount_for_completion) continue; //return console.log('found invalid cycle_info -> supported [d,m,y]'); // invalid format
        const [full_str, _, num_as_string, __] = once_of_as_cycle_Regex.exec(cycle_info);
        const multiply_amount = parseInt(num_as_string);
        if (!multiply_amount) continue; //console.log('found invalid multiply amount type -> supported only number');
        const comparison_target_day = added_amount_for_completion * multiply_amount;
        //console.log(comparison_target_day); // DEBUG ONLY
        const hit_period = isAlreadyPassedPeriodOfDay(day_passed, comparison_target_day);
        if (!hit_period) continue; // doesn't hit the period yet
        //console.log(`[TODO]: Cycle -> ${machine_name} hit cycle of "${cycle_info} => Pushing to notification"`);// DEBUG ONLY
        // TODO -> Remove it self
        const creation = await this.notificationService.createNotification({
          related_positions: null,
          message: `กรุณาตรวจสอบเครื่องตรวจวัด ${machine_name} เนื่องจากถึงรอบบำรุงรักษาแล้ว`,
          attached_params: `calibration:${id}:${machine_name}:${serial_number}:${instruction}`,
        });
        if (creation) {
          // if success @DELETE IT SELF
          target
            .remove()
            .then(() => console.log(`Removal of the timeout task -> maintenance id ${id} has been successfully removed`))
            .catch(() => console.log(`Unable to remove calibration id of ${id}`));
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────
  }
}

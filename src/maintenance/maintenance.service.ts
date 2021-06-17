import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMaintenanceCycleDTO } from './dto/create-maintenance-cycle.dto';
import { MaintenanceRepository } from './maintenance.repository';
import { Maintenance } from './model/maintenance.entity';
import { calculateDayPassed, isAlreadyPassedPeriodOfDay } from '../utilities/time/';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MaintenanceService {
  constructor(@InjectRepository(MaintenanceRepository) private maintenanceRepository: MaintenanceRepository, private notificationService: NotificationService) {}

  async getAllMaintenanceList() {
    return await this.maintenanceRepository.find();
  }

  async createMaintenanceCycle(createMaintananceCycleDTO: CreateMaintenanceCycleDTO) {
    return this.maintenanceRepository.createMaintenanceCycle(createMaintananceCycleDTO);
  }

  async removeMaintenanceCycle(id: number) {
    const removal = await this.maintenanceRepository.delete(id);
    if (!removal.affected) throw new NotFoundException(`MaintenanceCycle of id "${id}" doesn't exist`);
    return removal;
  }

  //
  // ─── SCHEDULE TASK ──────────────────────────────────────────────────────────────
  //
  @Cron('60 * * * * *')
  async handleCron() {
    function convert_cycle_type_to_day(dtype: 'd' | 'm' | 'y') {
      if (dtype === 'd') return 1;
      else if (dtype === 'm') return 30;
      else if (dtype === 'y') return 365;
      else null;
    }

    //console.log('CRON EVERY 30 SEC TRIGGERED');
    const maintenance_lists = await this.getAllMaintenanceList();
    //const target = maintenance_lists[0] as Maintenance; // target only 1 item first for testing
    const today = new Date(Date.now());
    /*const cycle_start = new Date('2021-05-01 01:54:54.412');
    const day_passed = calculateDayPassed(cycle_start, today);*/

    // MAIN CORE
    for (let target of maintenance_lists) {
      //console.log(target.cycle_start_at);
      const { cycle_info, machine_name, id, serial_number, instruction, who, station, cycle_start_at } = target;
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
          message: `กรุณาตรวจสอบและบำรุงรักษาเครื่องจักร ${machine_name} เนื่องจากถึงรอบบำรุงรักษาแล้ว`,
          attached_params: `maintenance:${id}:${machine_name}:${serial_number}:${instruction}:${who}:${station}`,
        });
        if (creation) {
          // if success
          //stamp the new date

          // NEWLY ADDED LOGIC
          // made static for the day but only add month
          const date = cycle_start_at;
          const current_month = today.getMonth();
          date.setMonth(current_month);
          if (date < today) {
            // if set to the current month and still less than today [add another month]
            date.setMonth(current_month + 1);
          }
          // • • • • •

          target.cycle_start_at = date;
          target.save().catch(() => console.log('[ERROR]: Cannot stamp the new date for maintenance id ' + id));
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
          message: `กรุณาตรวจสอบและบำรุงรักษาเครื่องจักร ${machine_name} เนื่องจากถึงรอบบำรุงรักษาแล้ว`,
          attached_params: `maintenance:${id}:${machine_name}:${serial_number}:${instruction}:${who}:${station}`,
        });
        if (creation) {
          // if success @DELETE IT SELF
          target
            .remove()
            .then(() => console.log(`Removal of the timeout task -> maintenance id ${id} has been successfully removed`))
            .catch(() => console.log(`Unable to remove maintenance id of ${id}`));
        }
      }
    }
    // ─────────────────────────────────────────────────────────────────
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

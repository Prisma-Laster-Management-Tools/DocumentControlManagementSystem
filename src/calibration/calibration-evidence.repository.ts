import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { User } from 'src/user/model/user.entity';

import { EntityRepository, Repository } from 'typeorm';
import { CreateCalibrationEvidenceDTO } from './dto/create-calibration-evidence.dto';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';
import { CalibrationEvidence } from './model/calibration-evidence.entity';
@EntityRepository(CalibrationEvidence)
export class CalibrationEvidenceRepository extends Repository<CalibrationEvidence> {
  private logger = new Logger();

  async createCalibrationEvidence(createCalibrationEvidenceDTO: CreateCalibrationEvidenceDTO, user: User, attachments: string, onEvidenceUploadCompletion: () => Promise<any>) {
    const { description, serial_number, machine_name, is_pass } = createCalibrationEvidenceDTO;
    const Evidence = new CalibrationEvidence();
    Evidence.description = description;
    Evidence.serial_number = serial_number;
    Evidence.machine_name = machine_name;
    Evidence.attachments = attachments;
    Evidence.is_pass = is_pass;
    Evidence.stamper_firstname = user.firstname;
    Evidence.stamper_lastname = user.lastname;
    try {
      const save_operation = await Evidence.save();
      await onEvidenceUploadCompletion(); // wait for the time stamping
      // TODO idea
      // Only stamp if the is_pass = true [NOT SURE IF THIS IS THE GREAT IDEA]
      // ─────────────────────────────────────────────────────────────────
    } catch (error) {
      throw error;
    }
  }
}

import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateCalibrationEvidenceDTO } from './dto/create-calibration-evidence.dto';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';
import { CalibrationEvidence } from './model/calibration-evidence.entity';
@EntityRepository(CalibrationEvidence)
export class CalibrationEvidenceRepository extends Repository<CalibrationEvidence> {
  private logger = new Logger();

  async createCalibrationEvidence(createCalibrationEvidenceDTO: CreateCalibrationEvidenceDTO, attachments: string) {
    const { description, serial_number, machine_name, is_pass } = createCalibrationEvidenceDTO;
    const Evidence = new CalibrationEvidence();
    Evidence.description = description;
    Evidence.serial_number = serial_number;
    Evidence.machine_name = machine_name;
    Evidence.attachments = attachments;
    Evidence.is_pass = is_pass;
    return await Evidence.save();
  }
}

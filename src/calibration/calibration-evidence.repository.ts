import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';
import { CalibrationEvidence } from './model/calibration-evidence.entity';
@EntityRepository(CalibrationEvidence)
export class CalibrationEvidenceRepository extends Repository<CalibrationEvidence> {
  private logger = new Logger();
}

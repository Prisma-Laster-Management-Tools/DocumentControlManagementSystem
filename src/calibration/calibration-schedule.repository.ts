import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CalibrationSchedule } from './model/calibration-schedule.entity';
@EntityRepository(CalibrationSchedule)
export class CalibrationScheduleRepository extends Repository<CalibrationSchedule> {
  private logger = new Logger();
}

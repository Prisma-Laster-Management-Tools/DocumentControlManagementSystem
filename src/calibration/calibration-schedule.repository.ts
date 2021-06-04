import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';
import { CalibrationSchedule } from './model/calibration-schedule.entity';
@EntityRepository(CalibrationSchedule)
export class CalibrationScheduleRepository extends Repository<CalibrationSchedule> {
  private logger = new Logger();

  async createCalibrationSchedule(createCalibrationCycleDTO: CreateCalibrationCycleDTO) {
    const { cycle_info, instruction, machine_name, serial_number, cycle_start_at } = createCalibrationCycleDTO;
    const MaintenanceCycle = new CalibrationSchedule();
    MaintenanceCycle.instruction = instruction;
    MaintenanceCycle.machine_name = machine_name;
    MaintenanceCycle.cycle_info = cycle_info;
    MaintenanceCycle.serial_number = serial_number;
    MaintenanceCycle.cycle_start_at = cycle_start_at;
    return await MaintenanceCycle.save();
  }
}

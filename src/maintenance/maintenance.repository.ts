import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateMaintenanceCycleDTO } from './dto/create-maintenance-cycle.dto';
import { Maintenance } from './model/maintenance.entity';
@EntityRepository(Maintenance)
export class MaintenanceRepository extends Repository<Maintenance> {
  private logger = new Logger();

  async createMaintenanceCycle(createMaintananceCycleDTO: CreateMaintenanceCycleDTO) {
    const { cycle_info, instruction, machine_name, serial_number, station, who } = createMaintananceCycleDTO;
    const MaintenanceCycle = new Maintenance();
    MaintenanceCycle.instruction = instruction;
    MaintenanceCycle.machine_name = machine_name;
    MaintenanceCycle.cycle_info = cycle_info;
    MaintenanceCycle.serial_number = serial_number;
    MaintenanceCycle.station = station;
    MaintenanceCycle.who = who;
    return await MaintenanceCycle.save();
  }
}

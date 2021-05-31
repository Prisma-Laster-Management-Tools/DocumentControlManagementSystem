import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMaintenanceCycleDTO } from './dto/create-maintenance-cycle.dto';
import { MaintenanceRepository } from './maintenance.repository';

@Injectable()
export class MaintenanceService {
  constructor(@InjectRepository(MaintenanceRepository) private maintenanceRepository: MaintenanceRepository) {}

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
}

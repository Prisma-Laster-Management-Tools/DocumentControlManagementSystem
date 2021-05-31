import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaintenanceRepository } from './maintenance.repository';

@Injectable()
export class MaintenanceService {
  constructor(@InjectRepository(MaintenanceRepository) private maintenanceRepository: MaintenanceRepository) {}

  async getAllMaintenanceList() {
    return await this.maintenanceRepository.find();
  }
}

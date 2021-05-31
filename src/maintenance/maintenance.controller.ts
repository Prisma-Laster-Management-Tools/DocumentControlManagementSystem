import { Controller, Get } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get()
  async getAllMaintenanceList() {
    return this.maintenanceService.getAllMaintenanceList();
  }
}

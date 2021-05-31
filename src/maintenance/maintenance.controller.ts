import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMaintenanceCycleDTO } from './dto/create-maintenance-cycle.dto';
import { MaintenanceService } from './maintenance.service';

@Controller('maintenance')
export class MaintenanceController {
  constructor(private maintenanceService: MaintenanceService) {}

  @Get()
  async getAllMaintenanceList() {
    return this.maintenanceService.getAllMaintenanceList();
  }

  @Post()
  async createMaintenanceCycle(@Body() createMaintananceCycleDTO: CreateMaintenanceCycleDTO) {
    return this.maintenanceService.createMaintenanceCycle(createMaintananceCycleDTO);
  }
}

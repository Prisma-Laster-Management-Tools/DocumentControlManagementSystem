import { Controller, Get } from '@nestjs/common';
import { CalibrationService } from './calibration.service';

@Controller('calibration')
export class CalibrationController {
  constructor(private calibrationService: CalibrationService) {}

  @Get()
  getAllCalibrationSchedules() {
    return this.calibrationService.getAllCalibrationSchedules();
  }
}

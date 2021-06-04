import { Body, Controller, Get, Post } from '@nestjs/common';
import { CalibrationService } from './calibration.service';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';

@Controller('calibration')
export class CalibrationController {
  constructor(private calibrationService: CalibrationService) {}

  @Get()
  getAllCalibrationSchedules() {
    return this.calibrationService.getAllCalibrationSchedules();
  }

  @Post()
  createCalibrationSchedule(@Body() createCalibrationCycleDTO: CreateCalibrationCycleDTO) {
    return this.calibrationService.createCalibrationSchedule(createCalibrationCycleDTO);
  }
}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

  @Delete('/:id')
  async removeCalibrationSchedule(@Param('id', ParseIntPipe) id: number) {
    return this.calibrationService.removeCalibrationSchedule(id);
  }
}

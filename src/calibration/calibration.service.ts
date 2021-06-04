import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';

@Injectable()
export class CalibrationService {
  constructor(@InjectRepository(CalibrationScheduleRepository) private calibrationScheduleRepository: CalibrationScheduleRepository) {}

  async getAllCalibrationSchedules() {
    return this.calibrationScheduleRepository.find();
  }
}

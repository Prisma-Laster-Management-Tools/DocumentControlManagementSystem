import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';

@Injectable()
export class CalibrationService {
  constructor(@InjectRepository(CalibrationScheduleRepository) private calibrationScheduleRepository: CalibrationScheduleRepository) {}

  async getAllCalibrationSchedules() {
    return this.calibrationScheduleRepository.find();
  }

  async createCalibrationSchedule(createCalibrationCycleDTO: CreateCalibrationCycleDTO) {
    return this.calibrationScheduleRepository.createCalibrationSchedule(createCalibrationCycleDTO);
  }
}

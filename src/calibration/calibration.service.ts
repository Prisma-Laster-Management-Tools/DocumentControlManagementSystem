import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalibrationEvidenceRepository } from './calibration-evidence.repository';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';
import { CreateCalibrationCycleDTO } from './dto/create-calibration-schedule.dto';

@Injectable()
export class CalibrationService {
  constructor(
    @InjectRepository(CalibrationScheduleRepository) private calibrationScheduleRepository: CalibrationScheduleRepository,
    @InjectRepository(CalibrationEvidenceRepository) private calibrationEvidenceRepository: CalibrationEvidenceRepository,
  ) {}

  async getAllCalibrationSchedules() {
    return this.calibrationScheduleRepository.find();
  }

  async createCalibrationSchedule(createCalibrationCycleDTO: CreateCalibrationCycleDTO) {
    return this.calibrationScheduleRepository.createCalibrationSchedule(createCalibrationCycleDTO);
  }

  async removeCalibrationSchedule(id: number) {
    const removal = await this.calibrationScheduleRepository.delete(id);
    if (!removal.affected) throw new NotFoundException(`CalibrationCycle of id "${id}" doesn't exist`);
    return removal;
  }

  //
  // ─── EVIDENCE ───────────────────────────────────────────────────────────────────
  //
  async gelAllCalibrationEvidence() {
    return await this.calibrationEvidenceRepository.find();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

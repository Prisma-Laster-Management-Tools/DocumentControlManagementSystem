import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';
import { CalibrationController } from './calibration.controller';
import { CalibrationService } from './calibration.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalibrationScheduleRepository])],
  controllers: [CalibrationController],
  providers: [CalibrationService],
})
export class CalibrationModule {}

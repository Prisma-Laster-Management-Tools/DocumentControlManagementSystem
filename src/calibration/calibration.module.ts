import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { CalibrationEvidenceRepository } from './calibration-evidence.repository';
import { CalibrationScheduleRepository } from './calibration-schedule.repository';
import { CalibrationController } from './calibration.controller';
import { CalibrationService } from './calibration.service';

@Module({
  imports: [TypeOrmModule.forFeature([CalibrationScheduleRepository, CalibrationEvidenceRepository]), NotificationModule],
  controllers: [CalibrationController],
  providers: [CalibrationService],
})
export class CalibrationModule {}

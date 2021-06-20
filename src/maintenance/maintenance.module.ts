import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationRepository } from 'src/notification/notification.repository';
import { NotificationService } from 'src/notification/notification.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceRepository } from './maintenance.repository';
import { MaintenanceService } from './maintenance.service';
import { Maintenance } from './model/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRepository, NotificationRepository]), NotificationModule],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, NotificationService],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}

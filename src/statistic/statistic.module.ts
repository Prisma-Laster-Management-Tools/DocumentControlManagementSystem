import { Module } from '@nestjs/common';
import { CalibrationModule } from 'src/calibration/calibration.module';
import { MaintenanceModule } from 'src/maintenance/maintenance.module';
import { ProductModule } from 'src/product/product.module';
import { PurchasementModule } from 'src/purchasement/purchasement.module';
import { QualityControlModule } from 'src/quality-control/quality-control.module';
import { RecruitmentModule } from 'src/recruitment/recruitment.module';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [QualityControlModule, ProductModule, PurchasementModule, RecruitmentModule, MaintenanceModule, CalibrationModule],
})
export class StatisticModule {}

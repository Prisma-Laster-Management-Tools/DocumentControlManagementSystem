import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { PurchasementModule } from 'src/purchasement/purchasement.module';
import { QualityControlModule } from 'src/quality-control/quality-control.module';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
  imports: [QualityControlModule, ProductModule, PurchasementModule],
})
export class StatisticModule {}

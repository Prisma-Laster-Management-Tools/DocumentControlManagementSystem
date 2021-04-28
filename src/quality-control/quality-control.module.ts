import { Module } from '@nestjs/common';
import { QualityControlController } from './quality-control.controller';
import { QualityControlService } from './quality-control.service';

@Module({
  controllers: [QualityControlController],
  providers: [QualityControlService]
})
export class QualityControlModule {}

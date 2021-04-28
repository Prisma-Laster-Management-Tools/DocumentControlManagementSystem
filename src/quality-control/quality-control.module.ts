import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlController } from './quality-control.controller';
import { QualityControlRepository } from './quality-control.repository';
import { QualityControlService } from './quality-control.service';

@Module({
  imports: [TypeOrmModule.forFeature([QualityControlRepository, QualityControlProtocolRepository])],
  controllers: [QualityControlController],
  providers: [QualityControlService],
})
export class QualityControlModule {}

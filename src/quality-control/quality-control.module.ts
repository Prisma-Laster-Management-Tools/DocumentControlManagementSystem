import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from 'src/product/product.module';
import { ProductRepository } from 'src/product/product.repository';
import { ProductService } from 'src/product/product.service';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlQueueRepository } from './quality-control-queue.repository';
import { QualityControlController } from './quality-control.controller';
import { QualityControlRepository } from './quality-control.repository';
import { QualityControlService } from './quality-control.service';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([QualityControlRepository, QualityControlProtocolRepository, QualityControlQueueRepository])],
  controllers: [QualityControlController],
  providers: [QualityControlService],
})
export class QualityControlModule {}

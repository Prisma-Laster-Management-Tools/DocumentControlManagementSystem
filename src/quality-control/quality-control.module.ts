import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProductModule } from 'src/product/product.module';
import { ProductRepository } from 'src/product/product.repository';
import { ProductService } from 'src/product/product.service';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlQueueRepository } from './quality-control-queue.repository';
import { QualityControlController } from './quality-control.controller';
import { QualityControlRepository } from './quality-control.repository';
import { QualityControlService } from './quality-control.service';

@Module({
  imports: [ProductModule, TypeOrmModule.forFeature([QualityControlRepository, QualityControlProtocolRepository, QualityControlQueueRepository]), AuthenticationModule],
  controllers: [QualityControlController],
  providers: [QualityControlService],
  exports: [QualityControlService],
})
export class QualityControlModule {}

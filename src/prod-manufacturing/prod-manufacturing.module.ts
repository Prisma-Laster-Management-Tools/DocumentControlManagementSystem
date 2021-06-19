import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdManufacturingController } from './prod-manufacturing.controller';
import { ProdManufacturingRepository } from './prod-manufacturing.repository';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProdManufacturingRepository])],
  controllers: [ProdManufacturingController],
  providers: [ProdManufacturingService],
})
export class ProdManufacturingModule {}

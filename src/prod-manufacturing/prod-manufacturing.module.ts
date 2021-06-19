import { Module } from '@nestjs/common';
import { ProdManufacturingController } from './prod-manufacturing.controller';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Module({
  controllers: [ProdManufacturingController],
  providers: [ProdManufacturingService]
})
export class ProdManufacturingModule {}

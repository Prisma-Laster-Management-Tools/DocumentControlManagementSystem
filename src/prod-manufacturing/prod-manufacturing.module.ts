import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ProductModule } from 'src/product/product.module';
import { ProdManufacturingController } from './prod-manufacturing.controller';
import { ProdManufacturingRepository } from './prod-manufacturing.repository';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProdManufacturingRepository]), ProductModule, AuthenticationModule],
  controllers: [ProdManufacturingController],
  providers: [ProdManufacturingService],
  exports: [ProdManufacturingService],
})
export class ProdManufacturingModule {}

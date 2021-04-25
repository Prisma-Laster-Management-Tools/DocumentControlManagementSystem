import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchasementSourceRepository } from './purchasement-source.repository';
import { PurchasementController } from './purchasement.controller';
import { PurchasementService } from './purchasement.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchasementSourceRepository])],
  controllers: [PurchasementController],
  providers: [PurchasementService],
})
export class PurchasementModule {}

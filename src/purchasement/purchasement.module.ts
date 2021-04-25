import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchansementSourceRepository } from './purchasement-source.repository';
import { PurchasementController } from './purchasement.controller';
import { PurchasementService } from './purchasement.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchansementSourceRepository])],
  controllers: [PurchasementController],
  providers: [PurchasementService],
})
export class PurchasementModule {}

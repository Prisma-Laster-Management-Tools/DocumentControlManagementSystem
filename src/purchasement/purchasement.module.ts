import { Module } from '@nestjs/common';
import { PurchasementController } from './purchasement.controller';
import { PurchasementService } from './purchasement.service';

@Module({
  controllers: [PurchasementController],
  providers: [PurchasementService]
})
export class PurchasementModule {}

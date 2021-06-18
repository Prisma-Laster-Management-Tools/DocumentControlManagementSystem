import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchansementPartRepository } from './purchasement-part.repository';
import { PurchasementRequestRepository } from './purchasement-request.repository';
import { PurchasementSourceRepository } from './purchasement-source.repository';
import { PurchasementController } from './purchasement.controller';
import { PurchasementService } from './purchasement.service';

@Module({
  imports: [TypeOrmModule.forFeature([PurchasementSourceRepository, PurchansementPartRepository, PurchasementRequestRepository])],
  controllers: [PurchasementController],
  providers: [PurchasementService],
  exports: [PurchasementService],
})
export class PurchasementModule {}

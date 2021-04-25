import { Body, Controller, Post } from '@nestjs/common';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { PurchasementService } from './purchasement.service';

@Controller('purchasement')
export class PurchasementController {
  constructor(private purchasementService: PurchasementService) {}

  @Post('/create-part-detail')
  async createPartDetail(@Body() createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    return this.purchasementService.createPartDetail(createPurchasementPartDetailDTO);
  }
}

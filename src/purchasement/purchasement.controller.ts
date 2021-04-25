import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { PurchasementService } from './purchasement.service';

@Controller('purchasement')
export class PurchasementController {
  constructor(private purchasementService: PurchasementService) {}

  @Post('/create-part-detail')
  async createPartDetail(@Body() createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    return this.purchasementService.createPartDetail(createPurchasementPartDetailDTO);
  }

  @Delete('/remove-part-detail/:part_number')
  async removePartDetail(@Param('part_number') part_number: string) {
    return this.purchasementService.removePartDetail(part_number);
  }
}

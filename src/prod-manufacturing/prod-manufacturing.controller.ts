import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateProductManufacturingShippingDTO } from './dto/create-prod-manufacturing-shipping.dto';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Controller('prod-manufacturing')
export class ProdManufacturingController {
  constructor(private prodManufacturingService: ProdManufacturingService) {}

  @Get('')
  getAllProductManufacturingData(@Query() query) {
    return this.prodManufacturingService.getAllProductManufacturingData(query);
  }

  @Get('/:generated_key')
  getProductManufacturingData(@Param('generated_key') generated_key: string) {
    return this.prodManufacturingService.getProductManufacturingData(generated_key);
  }

  @Post('/')
  createProductManufacturingShipping(@Body() createProductManufacturingShippingDTO: CreateProductManufacturingShippingDTO) {
    return this.prodManufacturingService.createProductManufacturingShipping(createProductManufacturingShippingDTO);
  }
}

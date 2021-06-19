import { Controller, Get, Query } from '@nestjs/common';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Controller('prod-manufacturing')
export class ProdManufacturingController {
  constructor(private prodManufacturingService: ProdManufacturingService) {}

  @Get('')
  getAllProductManufacturingData(@Query() query) {
    return this.prodManufacturingService.getAllProductManufacturingData(query);
  }
}

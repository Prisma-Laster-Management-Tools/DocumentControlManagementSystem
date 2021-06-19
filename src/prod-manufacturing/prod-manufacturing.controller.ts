import { Controller, Get } from '@nestjs/common';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Controller('prod-manufacturing')
export class ProdManufacturingController {
  constructor(private prodManufacturingService: ProdManufacturingService) {}

  @Get('')
  getAllProductManufacturingData() {}
}

import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createSalesData(@Body() createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesService.createSalesData(createSalesDataDTO);
  }
}

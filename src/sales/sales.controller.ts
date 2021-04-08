import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get()
  getAllSalesData() {
    return this.salesService.getAllSalesData();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createSalesData(@Body() createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesService.createSalesData(createSalesDataDTO);
  }

  @Delete('/:id')
  removeSalesData(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.removeSalesData(id);
  }
}

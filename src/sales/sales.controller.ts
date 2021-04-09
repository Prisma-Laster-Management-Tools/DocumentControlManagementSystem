import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  // @Get()
  // getAllSalesData() {
  //   return this.salesService.getAllSalesData();
  // }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    paginationDto.page = Number(paginationDto.page) || 1;
    paginationDto.limit = Number(paginationDto.limit) || 10;
    return this.salesService.findAll(paginationDto);
  }

  @Post()
  createSalesData(@Body() createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesService.createSalesData(createSalesDataDTO);
  }

  @Delete('/:id')
  removeSalesData(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.removeSalesData(id);
  }
}

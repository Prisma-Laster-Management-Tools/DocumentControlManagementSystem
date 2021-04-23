import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Redirect, Req, Request, Res, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesService } from './sales.service';

import * as express from 'express';
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

  @Get('/:id')
  findSales(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.findSales(id);
  }

  @Post()
  createSalesData(@Body() createSalesDataDTO: CreateSalesDataDTO) {
    return this.salesService.createSalesData(createSalesDataDTO);
  }

  @Post('/:id/feedback')
  redirect(@Response() response: express.Response, @Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    request.session.param_cached = { sales_id: id }; // using session -> on the other side will take this and do some action with it
    return response.redirect(307, `/api/feedback`);
  }

  @Delete('/:id/feedback')
  REDIRECTION_RemoveFeedback(@Response() response: express.Response, @Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    request.session.param_cached = { sales_id: id }; // using session -> on the other side will take this and do some action with it
    return response.redirect(303, `/api/feedback/removal`);
  }

  @Delete('/:id')
  removeSalesData(@Param('id', ParseIntPipe) id: number) {
    return this.salesService.removeSalesData(id);
  }
}

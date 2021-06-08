import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, Redirect, Req, Request, Res, Response, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreateSalesDataDTO } from './dto/create-sales-data.dto';
import { SalesService } from './sales.service';

import * as express from 'express';
import { FeedbackService } from 'src/feedback/feedback.service';
import { CreateFeedbackDTO } from 'src/feedback/dto/create-feedback.dto';
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService, private feedbackService: FeedbackService) {}

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

  @Get('/:id/feedback/create-feedback-access-link')
  // OLD PARAMS (@Response() response: express.Response, @Req() request: Request, @Param('id', ParseIntPipe) id: number)
  // If you extract the response -> u will no longer just return the request
  REDIRECTION_CreateFeedbackAccessLinkToken(@Param('id', ParseIntPipe) id: number) {
    /*request.session.param_cached = { sales_id: id }; // using session -> on the other side will take this and do some action with it
    return response.redirect(303, `/api/feedback/create-feedback-access-link`);*/
    // Session will be lost after redirection -> cross service call instead
    return this.feedbackService.createFeedbackAccessLinkToken(id);
  }

  @Get('/:id/feedback')
  getFeedback(@Response() response: express.Response, @Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return response.redirect(307, `/api/feedback/${id}`);
  }

  @Post('/:id/feedback')
  // OLD PARAMS (@Response() response: express.Response, @Req() request: Request, @Param('id', ParseIntPipe) id: number)
  // If you extract the response -> u will no longer just return the request
  redirect(@Body() createFeedbackDTO: CreateFeedbackDTO, @Param('id', ParseIntPipe) id: number) {
    /*request.session.param_cached = { sales_id: id }; // using session -> on the other side will take this and do some action with it
    return response.redirect(307, `/api/feedback`);*/
    return this.feedbackService.createFeedback(createFeedbackDTO, id);
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

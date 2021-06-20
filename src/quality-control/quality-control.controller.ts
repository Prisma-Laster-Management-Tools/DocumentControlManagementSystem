import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/user/model/user.entity';
import { CreateControlProcessBulkDTO } from './dto/create-control-process-bulk.dto';
import { CreateControlProcess } from './dto/create-control-process.dto';
import { CreateProtocalForProductDTO } from './dto/create-protocal-for-product.dto';
import { CreateQCQueueDTO } from './dto/create-qc-queue.dto';
import { QualityControlService } from './quality-control.service';

@Controller('quality-control')
export class QualityControlController {
  constructor(private qualityControlService: QualityControlService) {}

  //
  // ─── PROTOCOL ───────────────────────────────────────────────────────────────────
  //
  @Get('/get-protocol-lists/:product_code')
  getProductProtocolRule(@Param('product_code') product_code: string) {
    return this.qualityControlService.getProductProtocolRule(product_code);
  }

  @Post('/create-protocol')
  async createProtocolForProduct(@Body() createProtocalForProductDTO: CreateProtocalForProductDTO) {
    return this.qualityControlService.createProtocolForProduct(createProtocalForProductDTO);
  }

  @Delete('/remove-protocol/:id')
  async removeProductProtocol(@Param('id', ParseIntPipe) id: number) {
    return this.qualityControlService.removeProductProtocol(id);
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── QUEUE ──────────────────────────────────────────────────────────────────────
  //
  @Post('/queue')
  async createQCQueue(@Body() createQCQueueDTO: CreateQCQueueDTO) {
    return this.qualityControlService.createQCQueue(createQCQueueDTO);
  }

  @Delete('/queue/:product_id')
  async removeFromQueue(@Param('product_id', ParseIntPipe) serial_number: number) {
    return this.qualityControlService.removeFromQueue(serial_number);
  }

  @Get('/queue')
  async findAllQueue() {
    return this.qualityControlService.findAllQueue();
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PROD ───────────────────────────────────────────────────────────────────────
  //
  @Post('/control-phase')
  async createControlProcess(@Body() createControlProcess: CreateControlProcess) {
    return this.qualityControlService.createControlProcess(createControlProcess);
  }

  @Post('/control-phase@bulk')
  @UseGuards(AuthGuard())
  async createControlProcess_BULK(@Body() createControlProcessBulkDTO: CreateControlProcessBulkDTO, @GetUser() user: User) {
    return this.qualityControlService.createControlProcess_BULK(createControlProcessBulkDTO, user);
  }

  @Get('/control-phase/process')
  async findAllControlProcess() {
    return this.qualityControlService.findAllControlProcess();
  }
  @Get('/control-phase/process/:id')
  async findControlProcess(@Param('id', ParseIntPipe) id: number) {
    return this.qualityControlService.findControlProcess(id);
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

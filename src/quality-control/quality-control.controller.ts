import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

  @Get('/control-phase/process')
  async findAllControlProcess() {
    return this.qualityControlService.findAllControlProcess();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

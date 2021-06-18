import { BadRequestException, Get, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { uploadSinglePhoto } from 'src/utilities/fs/image-upload';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { CreatePurchasementRequestDTO } from './dto/create-purchasement-request.dto';
import { CreatePurchasementSourceDTO } from './dto/create-purchasement-source.dto';
import { CreateResponseToPurchasementRequest } from './dto/create-response-to-purchasement-request.dto';
import { PurchasementService } from './purchasement.service';

@Controller('purchasement')
export class PurchasementController {
  constructor(private purchasementService: PurchasementService) {}

  @Get('/part-detail')
  async getAllPartDetail() {
    return this.purchasementService.getAllPartDetail();
  }

  @Post('/create-part-detail')
  async createPartDetail(@Body() createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    return this.purchasementService.createPartDetail(createPurchasementPartDetailDTO);
  }

  @Delete('/remove-part-detail/:part_number')
  async removePartDetail(@Param('part_number') part_number: string) {
    return this.purchasementService.removePartDetail(part_number);
  }

  //
  // ─── SOURCE ─────────────────────────────────────────────────────────────────────
  //
  @Post('/create-source-detail')
  async createPurchasementSource(@Body() createPurchasementSourceDTO: CreatePurchasementSourceDTO) {
    return this.purchasementService.createPurchasementSource(createPurchasementSourceDTO);
  }

  @Get('source')
  async getAllSource() {
    return this.purchasementService.getAllSource();
  }

  @Get('/source/:id')
  async getSourceData(@Param('id', ParseIntPipe) id: number) {
    return this.purchasementService.getSourceData(id);
  }

  @Delete('/remove-source-detail/:id')
  async removePurchasementSource(@Param('id', ParseIntPipe) id: number) {
    return this.purchasementService.removePurchasementSource(id);
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PURCHASEMENT ───────────────────────────────────────────────────────────────
  //
  @Post('/create-purchasement-request')
  async createPurchasementRequest(@Body() createPurchasementRequestDTO: CreatePurchasementRequestDTO) {
    return this.purchasementService.createPurchasementRequest(createPurchasementRequestDTO);
  }

  @Delete('/remove-purchasement-request/:id')
  async removePurchasementRequest(@Param('id', ParseIntPipe) id: number) {
    return this.purchasementService.removePurchasementRequest(id);
  }

  @Get('/confirmation/:confirmation_token')
  async clientConfirmationTheRequestOrder(@Param('confirmation_token') confirmation_token: string) {
    return this.purchasementService.clientConfirmationTheRequestOrder(confirmation_token);
  }

  @Post('/confirmation/:confirmation_token/response')
  async clientResponseToPurchasementRequest(@Body() createResponseToPurchasementRequest: CreateResponseToPurchasementRequest, @Param('confirmation_token') confirmation_token: string) {
    return this.purchasementService.clientResponseToPurchasementRequest(createResponseToPurchasementRequest, confirmation_token);
  }

  @Get('/confirmation/:confirmation_token/close')
  async employeeClosePurchasementRequest(@Param('confirmation_token') confirmation_token: string) {
    return this.purchasementService.employeeClosePurchasementRequest(confirmation_token);
  }

  @Post('/confirmation/:confirmation_token/client-upload-evidence')
  @UseInterceptors(FileInterceptor('file'))
  async clientAttachEvidenceToPurchasementRequest(@UploadedFile() file: Express.Multer.File, @Param('confirmation_token') confirmation_token: string) {
    //TODO mime-type checking later
    if (!file) throw new BadRequestException('You have to upload the evidence');
    const upload = await uploadSinglePhoto(file);
    return this.purchasementService.clientAttachEvidenceToPurchasementRequest(confirmation_token, upload.stored_path as string);
  }

  @Get('/requests')
  async getAllPurchasementRequest(@Query() paginationDTO: PaginationDto) {
    paginationDTO.page = Number(paginationDTO.page) || 1;
    paginationDTO.limit = Number(paginationDTO.limit) || 10;
    return ResponseMsg.success(await this.purchasementService.getAllPurchasementRequest(paginationDTO));
  }
  // ─────────────────────────────────────────────────────────────────

  //
  // ─── TEST ───────────────────────────────────────────────────────────────────────
  //
  @Get('/sendmail')
  async sendMail() {
    return this.purchasementService.sendMail();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

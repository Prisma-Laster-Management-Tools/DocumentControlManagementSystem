import { BadRequestException, Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadSinglePhoto } from 'src/utilities/fs/image-upload';
import { CreateProductManufacturingShippingDTO } from './dto/create-prod-manufacturing-shipping.dto';
import { ProdManufacturingService } from './prod-manufacturing.service';

@Controller('prod-manufacturing')
export class ProdManufacturingController {
  constructor(private prodManufacturingService: ProdManufacturingService) {}

  @Get('')
  getAllProductManufacturingData(@Query() query) {
    return this.prodManufacturingService.getAllProductManufacturingData(query);
  }

  @Get('/:generated_key')
  getProductManufacturingData(@Param('generated_key') generated_key: string) {
    return this.prodManufacturingService.getProductManufacturingData(generated_key);
  }

  @Post('/')
  createProductManufacturingShipping(@Body() createProductManufacturingShippingDTO: CreateProductManufacturingShippingDTO) {
    return this.prodManufacturingService.createProductManufacturingShipping(createProductManufacturingShippingDTO);
  }

  @Post('/:generated_key/upload-evidence')
  @UseInterceptors(FileInterceptor('file'))
  async employeeAttachEvidenceToShippingRequest(@UploadedFile() file: Express.Multer.File, @Param('generated_key') generated_key: string) {
    //TODO mime-type checking later
    if (!file) throw new BadRequestException('You have to upload the evidence');
    const upload = await uploadSinglePhoto(file);
    return this.prodManufacturingService.employeeAttachEvidenceToShippingRequest(generated_key, upload.stored_path as string);
  }

  @Get(':generated_key/cancel')
  async employeeCancelTheShippingRequest(@Param('generated_key') generated_key: string) {
    return this.prodManufacturingService.employeeCancelTheShippingRequest(generated_key);
  }
}

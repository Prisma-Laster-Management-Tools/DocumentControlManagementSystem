import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create-product-detail')
  async createBaseProductDetail(@Body() createProductDetailDTO: CreateProductDetailDTO) {
    return this.productService.createBaseProductDetail(createProductDetailDTO);
  }

  @Delete('/remove-product-detail/:product_code')
  async removeBaseProductDetail(@Param('product_code') product_code: string) {
    return this.productService.removeBaseProductDetail(product_code);
  }

  @Post('/create-product')
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productService.createProduct(createProductDTO);
  }

  @Delete('/remove-product/:serial_number')
  async removeProduct(@Param('serial_number') serial_number: string) {
    return this.productService.removeProduct(serial_number);
  }

  @Get('/:serial_number')
  async getProduct(@Param('serial_number') serial_number: string) {
    return ResponseMsg.success(await this.productService.getProduct(serial_number));
  }

  @Get()
  async getAllProduct(@Query() paginationDto: PaginationDto) {
    paginationDto.page = Number(paginationDto.page) || 1;
    paginationDto.limit = Number(paginationDto.limit) || 10;
    return ResponseMsg.success(await this.productService.getAllProduct(paginationDto));
  }
}

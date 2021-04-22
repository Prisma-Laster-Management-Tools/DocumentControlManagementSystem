import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('/create-product-detail')
  async createBaseProductDetail(
    @Body() createProductDetailDTO: CreateProductDetailDTO,
  ) {
    return this.productService.createBaseProductDetail(createProductDetailDTO);
  }

  @Post('/create-product')
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productService.createProduct(createProductDTO);
  }

  @Get()
  async getAllProduct() {
    return this.productService.getAllProduct();
  }
}

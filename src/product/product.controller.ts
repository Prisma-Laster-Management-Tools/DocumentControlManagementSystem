import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
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
}

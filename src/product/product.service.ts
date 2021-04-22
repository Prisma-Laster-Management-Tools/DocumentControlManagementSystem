import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { ProductDetailRepository } from './product-detail.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductDetailRepository)
    private productDetailRepository: ProductDetailRepository,
  ) {}
  async createBaseProductDetail(
    createProductDetailDTO: CreateProductDetailDTO,
  ) {
    return this.productDetailRepository.createBaseProductDetail(
      createProductDetailDTO,
    );
  }
}

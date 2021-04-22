import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { ProductDetail } from './model/product-detail.entity';
@EntityRepository(ProductDetail)
export class ProductDetailRepository extends Repository<ProductDetail> {
  private logger = new Logger();

  async createBaseProductDetail(
    createProductDetailDTO: CreateProductDetailDTO,
  ) {
    const {
      product_name,
      product_description,
      product_code,
    } = createProductDetailDTO;
    const productDetail = new ProductDetail();
    productDetail.product_code = product_code;
    productDetail.product_name = product_name;
    productDetail.product_description = product_description;
    return await productDetail.save();
  }
}

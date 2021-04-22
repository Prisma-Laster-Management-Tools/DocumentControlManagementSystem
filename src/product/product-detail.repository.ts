import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { ProductDetail } from './model/product-detail.entity';
@EntityRepository(ProductDetail)
export class ProductDetailRepository extends Repository<ProductDetail> {
  private logger = new Logger();
}

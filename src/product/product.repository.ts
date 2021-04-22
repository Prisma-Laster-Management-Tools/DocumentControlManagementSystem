import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { Product } from './model/product.entity';
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger();
}

import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { Sales } from './model/sales.entity';
@EntityRepository(Sales)
export class SalesRepository extends Repository<Sales> {
  private logger = new Logger();
}

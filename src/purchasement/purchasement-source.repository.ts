import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { PurchasementSource } from './model/purchasement-source.entity';
@EntityRepository(PurchasementSource)
export class PurchasementSourceRepository extends Repository<PurchasementSource> {
  private logger = new Logger();
}

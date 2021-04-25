import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { PurchansementSource } from './model/purchasement-source.entity';
@EntityRepository(PurchansementSource)
export class PurchansementSourceRepository extends Repository<PurchansementSource> {
  private logger = new Logger();
}

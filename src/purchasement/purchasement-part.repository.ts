import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { PurchasementPart } from './model/purchasement-part.entity';
@EntityRepository(PurchasementPart)
export class PurchansementRequestRepository extends Repository<PurchasementPart> {
  private logger = new Logger();
}

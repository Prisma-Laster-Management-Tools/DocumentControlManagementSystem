import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { PurchasementRequest } from './model/purchasement-request.entity';
@EntityRepository(PurchasementRequest)
export class PurchasementRequestRepository extends Repository<PurchasementRequest> {
  private logger = new Logger();
}

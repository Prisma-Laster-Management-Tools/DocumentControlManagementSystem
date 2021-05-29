import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { QualityControlQueue } from './model/quality-control-queue.entity';
@EntityRepository(QualityControlQueue)
export class QualityControlQueueRepository extends Repository<QualityControlQueue> {
  private logger = new Logger();
}

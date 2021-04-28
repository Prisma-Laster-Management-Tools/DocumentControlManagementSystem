import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { QualityControl } from './model/quality-control.entity';
@EntityRepository(QualityControl)
export class QualityControlProtocolRepository extends Repository<QualityControl> {
  private logger = new Logger();
}

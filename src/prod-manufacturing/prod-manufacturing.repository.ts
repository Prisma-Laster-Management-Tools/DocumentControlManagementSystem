import { Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { User } from 'src/user/model/user.entity';

import { EntityRepository, Repository } from 'typeorm';
import { ProdManufacturing } from './model/prod-manufacturing.entity';
@EntityRepository(ProdManufacturing)
export class ProdManufacturingRepository extends Repository<ProdManufacturing> {
  private logger = new Logger();
}

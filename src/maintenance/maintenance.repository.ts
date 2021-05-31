import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { Maintenance } from './model/maintenance.entity';
@EntityRepository(Maintenance)
export class MaintenanceRepository extends Repository<Maintenance> {
  private logger = new Logger();
}

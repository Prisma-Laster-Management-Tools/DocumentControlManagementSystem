import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Product } from 'src/product/model/product.entity';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateControlProcess } from './dto/create-control-process.dto';
import { QualityControlProtocol } from './model/quality-control-protocol.entity';
import { QualityControl } from './model/quality-control.entity';
@EntityRepository(QualityControl)
export class QualityControlRepository extends Repository<QualityControl> {
  private logger = new Logger();
  async createControlProcess(createControlProcess: CreateControlProcess) {
    const { product_id, protocal_id, check_status } = createControlProcess;
    const QcProcess = new QualityControl();
    const Prod = new Product();
    const Protocal = new QualityControlProtocol();
    Prod.id = product_id;
    Protocal.id = protocal_id;
    QcProcess.product = Prod;
    QcProcess.protocol = Protocal;
    QcProcess.check_status = check_status;
    return await QcProcess.save();
  }
}

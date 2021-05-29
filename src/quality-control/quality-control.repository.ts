import { BadRequestException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
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

  async modifyControlProcess(createControlProcess: CreateControlProcess, entity?: QualityControl) {
    const { product_id, protocol_id, check_status } = createControlProcess;
    if (entity) {
      // if the entity is being passed by
      entity.check_status = check_status;
      return await entity.save();
    } else {
      //fetch again here [for shared across module supportation]
      const existed_process = await this.findOne({ product: { id: product_id }, protocol: { id: protocol_id } });
      existed_process.check_status = check_status;
      return await existed_process.save();
    }
  }

  async createControlProcess(createControlProcess: CreateControlProcess, $dequeue_func: Function) {
    const { product_id, protocol_id, check_status } = createControlProcess;

    //If process already exist -> modifile instead
    const existed_process = await this.findOne({ product: { id: product_id }, protocol: { id: protocol_id } });
    if (existed_process) {
      const modified_result = await this.modifyControlProcess(createControlProcess, existed_process);
      $dequeue_func(); // trigger checking process after
      return modified_result;
    }
    // ─────────────────────────────────────────────────────────────────

    const QcProcess = new QualityControl();
    const Prod = new Product();
    const Protocal = new QualityControlProtocol();
    Prod.id = product_id;
    Protocal.id = protocol_id;
    QcProcess.product = Prod;
    QcProcess.protocol = Protocal;
    QcProcess.check_status = check_status;
    const Creation_Result = await QcProcess.save();
    $dequeue_func(); // trigger checking process after
    return Creation_Result;
  }
}

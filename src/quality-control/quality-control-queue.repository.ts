import { BadRequestException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Product } from 'src/product/model/product.entity';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateQCQueueDTO } from './dto/create-qc-queue.dto';
import { QualityControlQueue } from './model/quality-control-queue.entity';
@EntityRepository(QualityControlQueue)
export class QualityControlQueueRepository extends Repository<QualityControlQueue> {
  private logger = new Logger();

  async createQCQueue(createQCQueueDTO: CreateQCQueueDTO, cb: Function) {
    const { product_id } = createQCQueueDTO;
    // check if queue already been pending
    const Existed_Queue = await this.findOne({ product: { id: product_id } });
    if (Existed_Queue) throw new BadRequestException(`Product with id of "${product_id}" is already in the queue`);
    // ─────────────────────────────────────────────────────────────────

    const Queue = new QualityControlQueue();
    const Prod = new Product();
    Prod.id = product_id;
    Queue.product = Prod;
    try {
      const save = await Queue.save();
      cb();
      return save;
    } catch (error) {
      console.log(error);
    }
  }
}

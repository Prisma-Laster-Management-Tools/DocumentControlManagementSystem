import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateProtocalForProductDTO } from './dto/create-protocal-for-product.dto';
import { CreateQCQueueDTO } from './dto/create-qc-queue.dto';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlQueueRepository } from './quality-control-queue.repository';
import { QualityControlRepository } from './quality-control.repository';

interface ILinkedRepositories {
  protocol: QualityControlProtocolRepository;
  product: QualityControlRepository;
  queue: QualityControlQueueRepository;
}

@Injectable()
export class QualityControlService {
  private linked_repositories: Partial<ILinkedRepositories> = {};
  constructor(
    @InjectRepository(QualityControlProtocolRepository) private qualityControlProtocolRepository: QualityControlProtocolRepository,
    @InjectRepository(QualityControlRepository) private qualityControlRepository: QualityControlRepository,
    @InjectRepository(QualityControlQueueRepository) private qualityControlQueueRepository: QualityControlQueueRepository,
    private productService: ProductService,
  ) {
    this.linked_repositories.product = qualityControlRepository;
    this.linked_repositories.protocol = qualityControlProtocolRepository;
    this.linked_repositories.queue = qualityControlQueueRepository;
  }

  //
  // ─── PROTOCOL ───────────────────────────────────────────────────────────────────
  //
  async getProductProtocolRule(product_code: string) {
    await this.productService.getBaseProduct(product_code); // check if product_code exist
    return this.linked_repositories.protocol.createQueryBuilder('protocol').where('protocol.product_code = :product_code', { product_code }).orderBy('protocol.process_order', 'ASC').getMany();
  }
  async createProtocolForProduct(createProtocalForProductDTO: CreateProtocalForProductDTO) {
    return this.linked_repositories.protocol.createProtocolForProduct(createProtocalForProductDTO);
  }
  async removeProductProtocol(id: number) {
    const removal = await this.linked_repositories.protocol.delete(id);
    if (!removal.affected) throw new NotFoundException(`Product protocal with id "${id}" doesn't exist`);

    //TODO Delete all of the qc-product that containing this id
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── QUEUE ──────────────────────────────────────────────────────────────────────
  //
  async createQCQueue(createQCQueueDTO: CreateQCQueueDTO) {
    await this.productService.getProductById(createQCQueueDTO.product_id); // check if product_code exist
    return this.linked_repositories.queue.createQCQueue(createQCQueueDTO);
  }
  async findAllQueue() {
    return this.linked_repositories.queue.find();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateControlProcess } from './dto/create-control-process.dto';
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

  //SHARED
  async getQCProtocolById(id: number) {
    const protocol = await this.linked_repositories.protocol.findOne(id);
    if (!protocol) throw new NotFoundException(`Protocol with id of "${id} doesn't exist"`);
    return protocol;
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
  async dequeueProductFromQueue(product_id: number) {
    const removal = await this.linked_repositories.queue.delete({ product: { id: product_id } });
    // if (!removal) throw new NotFoundException(`Protocol with id of "${product_id} doesn't exist"`);
    if (removal.affected) return true;
    return false;
  }
  async ifShouldDequeueFromQueueThenDequeue(product_id: number) {
    const { product_code } = await this.productService.getProductById(product_id);
    const ProtocolList = await this.getProductProtocolRule(product_code);
    const protocol_list_count = ProtocolList.length;
    const passed_process = await this.linked_repositories.product.find({ product: { id: product_id }, check_status: true });
    const passed_process_count = passed_process.length;

    if (passed_process_count === protocol_list_count) {
      console.log('Should Dequeue product id === ' + product_id + ' from the queue list');
      //dequeue
      const dequeue_success = await this.dequeueProductFromQueue(product_id);
      if (dequeue_success) console.log(`Dequeue product_id ${product_id} successfully`);
      else console.log(`Dequeue product_id ${product_id} failed`);
    } else console.log('Should not Dequeue product id === ' + product_id + ' from the queue list');
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PROD ───────────────────────────────────────────────────────────────────────
  //
  async createControlProcess(createControlProcess: CreateControlProcess) {
    const { product_id, protocol_id } = createControlProcess;
    await this.productService.getProductById(product_id); // check if product exist
    await this.getQCProtocolById(protocol_id); // check if protocol is exist

    const dequeue_process = () => this.ifShouldDequeueFromQueueThenDequeue(product_id);

    return this.linked_repositories.product.createControlProcess(createControlProcess, dequeue_process);
  }
  async findAllControlProcess() {
    return this.linked_repositories.product.find();
  }
  async findControlProcess(id: number) {
    const Processes = await await this.linked_repositories.product.find({ product: { id } });
    if (!Processes) throw new NotFoundException(`Product with id of "${id}" doesn't have any existed qc_process in progress`);
    return Processes;
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

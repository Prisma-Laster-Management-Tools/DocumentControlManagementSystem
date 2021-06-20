import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from 'src/product/product.service';
import { CreateControlProcessBulkDTO } from './dto/create-control-process-bulk.dto';
import { CreateControlProcess } from './dto/create-control-process.dto';
import { CreateProtocalForProductDTO } from './dto/create-protocal-for-product.dto';
import { CreateQCQueueDTO } from './dto/create-qc-queue.dto';
import { QualityControlProtocolRepository } from './quality-control-protocal.repository';
import { QualityControlQueueRepository } from './quality-control-queue.repository';
import { QualityControlRepository } from './quality-control.repository';
import { getConnection } from 'typeorm';
import { QualityControl } from './model/quality-control.entity';
import { getRandomString } from 'src/utilities/random/string';
import { Product } from 'src/product/model/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { User } from 'src/user/model/user.entity';

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
    const Prod = await this.productService.getProductById(createQCQueueDTO.product_id); // check if product_code exist

    // If Prod.quality_passed === null -> means it hasn't been qualitied yet [so no need to flag as false]
    //const cb_reset_product_qc_state_as_false = Prod.quality_passed === null ? () => this.productService.markProductFailTheQuailityChecked(createQCQueueDTO.product_id) : () => {}
    const cb_reset_product_qc_state_as_false = () => {}; // @NOTE -> EMPTY FOR NOW

    return this.linked_repositories.queue.createQCQueue(createQCQueueDTO, cb_reset_product_qc_state_as_false);
  }
  async removeFromQueue(product_id: number) {
    const removal = await this.linked_repositories.queue.delete({ product: { id: product_id } });
    if (!removal.affected) throw new BadRequestException(`Product with id of ${product_id} is not currently in the queue`);
    return removal;
  }
  async findAllQueue() {
    return this.linked_repositories.queue.find();
  }
  async dequeueProductFromQueue(product_id: number) {
    const removal = await this.linked_repositories.queue.delete({ product: { id: product_id } });
    // if (!removal) throw new NotFoundException(`Protocol with id of "${product_id} doesn't exist"`);
    if (removal.affected) {
      this.productService
        .markProductPassTheQuailityChecked(product_id)
        .then(() => {
          console.log(`Product id:${product_id} successfully marked as qc-passed`);
        })
        .catch(() => console.log(`Product id:${product_id} has failed to marked as qc-passed`));
      return true;
    }
    return false;
  }
  async ifShouldDequeueFromQueueThenDequeue(product_id: number, group_code: string) {
    const Product = await this.productService.getProductById(product_id);
    const { product_code } = Product;
    const ProtocolList = await this.getProductProtocolRule(product_code);
    const protocol_list_count = ProtocolList.length;
    const passed_process = await this.linked_repositories.product.find({ product: { id: product_id }, check_status: true, group_code });
    const passed_process_count = passed_process.length;

    if (passed_process_count === protocol_list_count) {
      console.log('Should Dequeue product id === ' + product_id + ' from the queue list');
      //dequeue
      const dequeue_success = await this.dequeueProductFromQueue(product_id);
      if (dequeue_success) console.log(`Dequeue product_id ${product_id} successfully`);
      else console.log(`Dequeue product_id ${product_id} failed`);
    } else {
      // means to mark as false
      this.productService.markProductFailTheQuailityChecked(product_id); // @NOTE -> maybe just only set to false when it is being appended to the q list
      console.log('Should not Dequeue product id === ' + product_id + ' from the queue list');
    }
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PROD ───────────────────────────────────────────────────────────────────────
  //
  async createControlProcess(createControlProcess: CreateControlProcess) {
    const { product_id, protocol_id } = createControlProcess;
    await this.productService.getProductById(product_id); // check if product exist
    await this.getQCProtocolById(protocol_id); // check if protocol is exist

    const dequeue_process = () => this.ifShouldDequeueFromQueueThenDequeue(product_id, 'group-code');

    return this.linked_repositories.product.createControlProcess(createControlProcess, dequeue_process);
  }

  async createControlProcess_BULK(createControlProcessBulkDTO: CreateControlProcessBulkDTO, user: User) {
    const { product_id, qc_datas } = createControlProcessBulkDTO;

    // Check if this product_id is in the queue-list or not
    const IsInQueue = await this.linked_repositories.queue.findOne({ product: { id: product_id } });
    if (!IsInQueue) throw new BadRequestException(`This product is currently not in the queue process`);
    // ─────────────────────────────────────────────────────────────────

    // check if qc_datas is containing the right data form
    const valid_format = qc_datas.every((each: Object) => {
      if (each.hasOwnProperty('protocol_id') && each.hasOwnProperty('check_status')) return true;
      return false;
    });
    // ─────────────────────────────────────────────────────────────────
    if (!valid_format) return new BadRequestException(`Invalid format of the qc_datas`);

    const { product_code } = await this.productService.getProductById(product_id);
    const ProtocolList = await this.getProductProtocolRule(product_code); // getting protocol list

    // check if qc_datas contains all of the protocol list
    const ProtocolListAsStringArray = ProtocolList.map((proto) => proto.id).sort((a, b) => a - b); // sorting in ascending order
    const QcDatasListAsStringArray = qc_datas.map((qc_data) => qc_data.protocol_id).sort((a, b) => a - b);
    const IsQcDatasCoverAllProtocolList = ProtocolListAsStringArray.every((value, index) => value === QcDatasListAsStringArray[index]);
    if (!IsQcDatasCoverAllProtocolList) return new BadRequestException(`qc_datas doesn't contain all of the protocols`);

    // @ LOGIC -> 1. Remove all existing qc-process with the product id of ${product_id} -> insertion of the bulk list
    /* @ LOGIC(2) -> 1. Create column for qc-product which is group_code -> to contain the random generated string so we don't have to remove a
    all existing qc-process everytime because we can use this random generated string to separate the group and the period of time of the qc process*/
    /*try {
      await this.linked_repositories.product.delete({ product: { id: product_id } });
    } catch (error) {
      throw new InternalServerErrorException(`Removal of the current existing doesn't sucesss`);
    }*/
    let group_code = 'xxx-xxx-xxx';
    while (true) {
      group_code = getRandomString(8);
      const exist = await this.linked_repositories.product.findOne({ group_code });
      if (!exist) break; // break if the group code isn't already taken
    }
    const ListOfInsertion = qc_datas.map((qc_data) => {
      const Qc = new QualityControl();
      const Prod_Pointer = new Product();
      Prod_Pointer.id = product_id;
      Qc.product = Prod_Pointer;
      Qc.protocol = qc_data.protocol_id;
      Qc.check_status = qc_data.check_status;
      Qc.group_code = group_code;
      Qc.number_of_protocol = ProtocolList.length;
      Qc.protocol_description = ProtocolList.find((protocol) => protocol.id === qc_data.protocol_id).process_description;
      Qc.stamper_firstname = user.firstname;
      Qc.stamper_lastname = user.lastname;
      return Qc;
    });

    try {
      const bulk_insertion = await getConnection().createQueryBuilder().insert().into(QualityControl).values(ListOfInsertion).execute();
      await this.ifShouldDequeueFromQueueThenDequeue(product_id, group_code); // await is not required -> but this incase of doing some fresh quick refreshing on the frontend site -> to remove the queue from the list up in time
      return bulk_insertion;
    } catch (error) {
      return new InternalServerErrorException(`Cannot do the certain operation -> bulk creation`);
    }
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

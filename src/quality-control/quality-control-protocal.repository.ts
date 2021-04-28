import { BadRequestException, ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateProtocalForProductDTO } from './dto/create-protocal-for-product.dto';
import { QualityControlProtocol } from './model/quality-control-protocol.entity';
import { QualityControl } from './model/quality-control.entity';
@EntityRepository(QualityControlProtocol)
export class QualityControlProtocolRepository extends Repository<QualityControlProtocol> {
  private logger = new Logger();

  async createProtocolForProduct(createProtocalForProductDTO: CreateProtocalForProductDTO) {
    const { process_description, process_order, product_code, required_attachment } = createProtocalForProductDTO;

    //Check if process_order is duplicated
    const process_exist = await this.findOne({ product_code, process_order });
    if (process_exist) throw new BadRequestException(`This qc-process and step is already declared for this product`);
    // ─────────────────────────────────────────────────────────────────

    const Protocol = new QualityControlProtocol();
    Protocol.product_code = product_code;
    Protocol.process_order = process_order;
    Protocol.process_description = process_description;
    Protocol.required_attachment = required_attachment;
    return await Protocol.save();
  }
}

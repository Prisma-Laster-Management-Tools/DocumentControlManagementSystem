import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreatePurchasementRequestDTO } from './dto/create-purchasement-request.dto';
import { PurchasementRequest } from './model/purchasement-request.entity';
@EntityRepository(PurchasementRequest)
export class PurchasementRequestRepository extends Repository<PurchasementRequest> {
  private logger = new Logger();

  async createPurchasementRequest(createPurchasementRequestDTO: CreatePurchasementRequestDTO) {
    let { commercial_number, is_special_request, special_part_name, quantity, special_part_contact } = createPurchasementRequestDTO;
    const IsSpecialRequest = is_special_request && special_part_name ? true : false;
    if (IsSpecialRequest) commercial_number = 'CUSTOM'; // if it's special request
    const PurchasementReq = new PurchasementRequest();
    PurchasementReq.commercial_number = commercial_number;
    PurchasementReq.quantity = quantity;
    PurchasementReq.is_special_request = IsSpecialRequest;
    PurchasementReq.special_part_name = special_part_name;
    PurchasementReq.special_part_contact = special_part_contact;
    return await PurchasementReq.save();
  }
}

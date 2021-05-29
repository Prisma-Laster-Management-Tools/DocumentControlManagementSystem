import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { PaginateResult, PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { getRandomString } from 'src/utilities/random/string';

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

    let random_access_token;
    while (true) {
      random_access_token = getRandomString(10);

      //check-in
      const existed_pr_with_this_token = await this.findOne({ confirmation_token: random_access_token });
      if (!existed_pr_with_this_token) break; // break if it's not exist
    }

    PurchasementReq.confirmation_token = random_access_token;

    return await PurchasementReq.save();

    // TODO Send email to the target source
  }

  async getAllPurchasementRequest(paginationDTO: PaginationDto): Promise<PaginateResult> {
    const skippedItem = (paginationDTO.page - 1) * paginationDTO.limit;
    let totalCount = await this.count();
    const PAGINATION_QUERY_STR = `OFFSET ${skippedItem} ROWS FETCH NEXT ${paginationDTO.limit} ROWS ONLY`;

    const PURCHASEMENT_REQS = await this.query(
      `SELECT pr.*,ps.part_number,company,email,seller from public.purchasement_request pr LEFT JOIN public.purchasement_source ps ON ps.commercial_number = pr.commercial_number ORDER BY pr."createdAt" DESC ${PAGINATION_QUERY_STR}`,
    );

    return {
      totalCount,
      page: paginationDTO.page,
      limit: paginationDTO.limit,
      data: PURCHASEMENT_REQS,
      totalPage: totalCount < paginationDTO.limit ? 1 : Math.floor(totalCount / paginationDTO.limit),
    };
  }
}

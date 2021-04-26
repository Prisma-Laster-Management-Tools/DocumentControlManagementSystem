import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreatePurchasementPartDetailDTO } from './dto/create-purchasement-part-detail.dto';
import { PurchasementPart } from './model/purchasement-part.entity';
@EntityRepository(PurchasementPart)
export class PurchansementPartRepository extends Repository<PurchasementPart> {
  private logger = new Logger();

  async createPartDetail(createPurchasementPartDetailDTO: CreatePurchasementPartDetailDTO) {
    const { part_number, part_name, part_description } = createPurchasementPartDetailDTO;
    const Part = new PurchasementPart();
    Part.part_number = part_number;
    Part.part_name = part_name;
    Part.part_description = part_description;
    return await Part.save();
  }
}

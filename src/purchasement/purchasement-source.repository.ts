import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreatePurchasementSourceDTO } from './dto/create-purchasement-source.dto';
import { PurchasementSource } from './model/purchasement-source.entity';
@EntityRepository(PurchasementSource)
export class PurchasementSourceRepository extends Repository<PurchasementSource> {
  private logger = new Logger();

  async createPurchasementSource(createPurchasementSourceDTO: CreatePurchasementSourceDTO) {
    const { part_number, company, email, seller } = createPurchasementSourceDTO;
    const Source = new PurchasementSource();
    Source.part_number = part_number;
    Source.company = company;
    Source.email = email;
    Source.seller = seller;
    return await Source.save();
  }
}

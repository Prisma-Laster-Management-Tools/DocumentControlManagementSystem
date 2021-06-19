import { Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { User } from 'src/user/model/user.entity';
import { getRandomString } from 'src/utilities/random/string';

import { EntityRepository, Repository } from 'typeorm';
import { CreateProductManufacturingShippingDTO } from './dto/create-prod-manufacturing-shipping.dto';
import { ProdManufacturing } from './model/prod-manufacturing.entity';
@EntityRepository(ProdManufacturing)
export class ProdManufacturingRepository extends Repository<ProdManufacturing> {
  private logger = new Logger();

  // @NOTE -> This gonna be huge
  async createProductManufacturingShipping(createProductManufacturingShippingDTO: CreateProductManufacturingShippingDTO) {
    const { buyer_contact, price, product_code, buyer_name, product_name, total_products } = createProductManufacturingShippingDTO;
    const ProdManuEntity = new ProdManufacturing();
    ProdManuEntity.product_code = product_code;
    ProdManuEntity.product_name = product_name;
    ProdManuEntity.total_products = total_products;
    ProdManuEntity.price = price;
    ProdManuEntity.buyer_name = buyer_name;
    ProdManuEntity.buyer_contact = buyer_contact;

    let random_access_token: string;
    while (true) {
      random_access_token = getRandomString(10);

      //check-in
      const existed_pr_with_this_token = await this.findOne({ generated_key: random_access_token });
      if (!existed_pr_with_this_token) break; // break if it's not exist
    }

    ProdManuEntity.generated_key = random_access_token;

    return await ProdManuEntity.save();
  }
}

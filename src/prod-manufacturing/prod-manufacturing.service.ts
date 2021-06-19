import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProdManufacturing } from './model/prod-manufacturing.entity';
import { ProdManufacturingRepository } from './prod-manufacturing.repository';

@Injectable()
export class ProdManufacturingService {
  constructor(@InjectRepository(ProdManufacturingRepository) private prodManufacturingRepository: ProdManufacturingRepository) {}

  async getAllProductManufacturingData(query: any) {
    const { join_prod } = query;
    if (!join_prod) return await this.prodManufacturingRepository.find();
    // If joining product
    return await this.prodManufacturingRepository.createQueryBuilder('prod_manu').leftJoinAndSelect('prod_manu.product', 'product').getMany();
  }
}

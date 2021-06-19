import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getProductManufacturingData(generated_key: string) {
    const prod_manu = await this.prodManufacturingRepository.findOne({
      where: { generated_key },
      join: {
        alias: 'prod_manu',
        leftJoinAndSelect: {
          product: 'prod_manu.product',
        },
      },
    });
    if (!prod_manu) throw new NotFoundException(`ProductManufacturing with the generated key of "${generated_key}" does not exist`);
    return prod_manu;
  }
}

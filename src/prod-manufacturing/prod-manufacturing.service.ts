import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/model/product.entity';
import { ProductService } from 'src/product/product.service';
import { getConnection, In, UpdateResult } from 'typeorm';
import { CreateProductManufacturingShippingDTO } from './dto/create-prod-manufacturing-shipping.dto';
import { ProdManufacturing } from './model/prod-manufacturing.entity';
import { ProdManufacturingRepository } from './prod-manufacturing.repository';

@Injectable()
export class ProdManufacturingService {
  constructor(@InjectRepository(ProdManufacturingRepository) private prodManufacturingRepository: ProdManufacturingRepository, private productService: ProductService) {}

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

  async createProductManufacturingShipping(createProductManufacturingShippingDTO: CreateProductManufacturingShippingDTO) {
    const { product_code, total_products } = createProductManufacturingShippingDTO;
    const product_with_passed_quality_checking = await this.productService.productRepository.find({ product_code, quality_passed: true });
    if (product_with_passed_quality_checking.length < total_products)
      throw new BadRequestException(`Don't have enough of product with product_code:"${product_code}" to serve shipping with total amount of "${total_products}"`);

    //
    // ─── CB ─────────────────────────────────────────────────────────────────────────
    //
    const mark_products_as_shipping_pending = async (generated_key: string): Promise<UpdateResult> => {
      const prod_serial_number_lists_in_array = product_with_passed_quality_checking.map((data) => data.serial_number);

      // @NOTE update_operation have to be done after the product_manufact_shipping process itself got created
      // @DESC if you want to skip this check [not reccommended setting createForignKeyContranits to false in the relation descriibing in the entity file]
      const update_operation = await getConnection()
        .createQueryBuilder()
        .update(Product)
        .set({ prod_manufact_code: generated_key })
        .where({ serial_number: In(prod_serial_number_lists_in_array) })
        .execute();

      return update_operation;
    };

    const reverse_marking_shiping_phase = async (generated_key: string): Promise<UpdateResult> => {
      const update_operation = await getConnection().createQueryBuilder().update(Product).set({ prod_manufact_code: null }).where({ prod_manufact_code: generated_key }).execute();

      return update_operation;
    };
    // ────────────────────────────────────────────────────────────────────────────────

    return this.prodManufacturingRepository.createProductManufacturingShipping(createProductManufacturingShippingDTO, mark_products_as_shipping_pending, reverse_marking_shiping_phase);
  }

  async employeeAttachEvidenceToShippingRequest(generated_key: string, evidence_path: string) {
    const ProdManuProcess = await this.prodManufacturingRepository.findOne({ generated_key });
    if (!ProdManuProcess) throw new NotFoundException(`ProductManufacturing Process with the generated_key:"${generated_key}" doesn't exist`);
    ProdManuProcess.shipping_evidence = evidence_path;
    ProdManuProcess.shipping_evidence_uploaded_at = new Date(Date.now());
    ProdManuProcess.shipping_status = true; // this might be useless -> cuz we can check directly thru the evidence_path
    return await ProdManuProcess.save();
  }

  async employeeCancelTheShippingRequest(generated_key: string) {
    const ProdManuProcess = await this.prodManufacturingRepository.findOne({ generated_key });
    if (!ProdManuProcess) throw new NotFoundException(`ProductManufacturing Process with the generated_key:"${generated_key}" doesn't exist`);
    ProdManuProcess.shipping_status = false; // cancel

    // this should be btw have no problems -> and we no need to wait for it or do we? [i think we need to]
    try {
      const update_operation = await getConnection().createQueryBuilder().update(Product).set({ prod_manufact_code: null }).where({ prod_manufact_code: generated_key }).execute();
      console.log(update_operation); // debugging
      return await ProdManuProcess.save();
    } catch (error) {
      throw error;
    }
  }
}

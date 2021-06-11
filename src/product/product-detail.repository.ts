import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { QualityControlProtocol } from 'src/quality-control/model/quality-control-protocol.entity';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { QueryGetBaseProductDTO } from './dto/query-get-base-prod.dto';
import { ProductDetail } from './model/product-detail.entity';
@EntityRepository(ProductDetail)
export class ProductDetailRepository extends Repository<ProductDetail> {
  private logger = new Logger();

  async getAllBaseProductDetail(queryGetBaseProductDTO: QueryGetBaseProductDTO) {
    const { with_protocol } = queryGetBaseProductDTO;
    if (!with_protocol) return this.find();
    return await this.createQueryBuilder('prod_detail').leftJoinAndSelect('prod_detail.protocol', 'quality_control_protocol').getMany(); // the right side quality_control_protocol is the alias [ it can be any in this case -> i already test]
  }

  async createBaseProductDetail(createProductDetailDTO: CreateProductDetailDTO) {
    const { product_name, product_description, product_code } = createProductDetailDTO;
    const productDetail = new ProductDetail();
    productDetail.product_code = product_code;
    productDetail.product_name = product_name;
    productDetail.product_description = product_description;
    return await productDetail.save();
  }
}

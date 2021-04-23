import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sales } from 'src/sales/model/sales.entity';
import { PaginateResult, PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from './model/product.entity';
import { ProductDetailRepository } from './product-detail.repository';
@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger();

  async createProduct(createProductDTO: CreateProductDTO) {
    const { product_code, serial_number } = createProductDTO;
    const ProductEntity = new Product();
    ProductEntity.product_code = product_code;
    ProductEntity.serial_number = serial_number;
    return await ProductEntity.save();
  }

  async getAllProduct(paginationDto: PaginationDto): Promise<PaginateResult> {
    const skippedItem = (paginationDto.page - 1) * paginationDto.limit;
    let totalCount = await this.count();
    const PAGINATION_QUERY_STR = `OFFSET ${skippedItem} ROWS FETCH NEXT ${paginationDto.limit} ROWS ONLY`;

    const SEARCH_CONDITION_RENDERED = `${paginationDto.search ? `%${paginationDto.search}%` : '%%'}`;

    // To specify the casein-sensitive -> u must provide "" like -> prod."createdAt" in order to b working
    const Plain_Products_Query = `SELECT prod.*,prod_detail.product_name,prod_detail.product_description FROM public.product prod LEFT JOIN public.product_detail prod_detail ON prod.product_code=prod_detail.product_code WHERE prod.serial_number LIKE '${SEARCH_CONDITION_RENDERED}' ORDER BY prod."createdAt" DESC`;
    const Plain_Products_Query_With_Pagination = Plain_Products_Query + ` ${PAGINATION_QUERY_STR}`;

    const [getCountPromise, Products] = await Promise.all([
      paginationDto.search
        ? new Promise(async (resolve, reject) => {
            const all_plain_products_with_no_pagination = await this.query(Plain_Products_Query);
            resolve(all_plain_products_with_no_pagination.length);
          })
        : new Promise((resolve) => {
            resolve(false);
          }),
      this.query(Plain_Products_Query_With_Pagination),
    ]);

    return {
      totalCount,
      page: paginationDto.page,
      limit: paginationDto.limit,
      data: Products,
      totalPage: totalCount < paginationDto.limit ? 1 : Math.floor(totalCount / paginationDto.limit),
    };
  }
}

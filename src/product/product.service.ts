import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { getRandomString } from 'src/utilities/random/string';
import { getConnection, In } from 'typeorm';
import { CreateProductBulkDTO } from './dto/create-product-bulk.dto';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { QueryGetBaseProductDTO } from './dto/query-get-base-prod.dto';
import { Product } from './model/product.entity';
import { ProductDetailRepository } from './product-detail.repository';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductDetailRepository)
    private productDetailRepository: ProductDetailRepository,
    @InjectRepository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  //
  // ─── BASE PROD ──────────────────────────────────────────────────────────────────
  //
  async createBaseProductDetail(createProductDetailDTO: CreateProductDetailDTO) {
    return this.productDetailRepository.createBaseProductDetail(createProductDetailDTO);
  }

  async removeBaseProductDetail(product_code: string) {
    const removal = await this.productDetailRepository.delete({ product_code });
    if (!removal.affected) throw new NotFoundException(`Product-Detail with code "${product_code}" doesn't exist`);
    return removal;
  }

  async getAllBaseProductDetail(queryGetBaseProductDTO: QueryGetBaseProductDTO) {
    return this.productDetailRepository.getAllBaseProductDetail(queryGetBaseProductDTO);
  }

  async getBaseProduct(product_code: string) {
    const Prod = await this.productDetailRepository.findOne({ product_code });
    if (!Prod) throw new NotFoundException(`Product Code of "${product_code}" doesn't exist in database`);
    return Prod;
  }
  // ────────────────────────────────────────────────────────────────────────────────

  //
  // ─── PROD ENTITY ────────────────────────────────────────────────────────────────
  //

  async createProduct(createProductDTO: CreateProductDTO) {
    //check phase
    const { product_code } = createProductDTO;
    const product = await this.productDetailRepository.findOne({
      product_code,
    });
    if (!product) throw new BadRequestException(`Product Code of "${product_code}" doesn't exist in database`);
    // ─────────────────────────────────────────────────────────────────
    return this.productRepository.createProduct(createProductDTO);
  }

  async removeProduct(serial_number: string) {
    const removal = await this.productRepository.delete({ serial_number });
    if (!removal.affected) throw new NotFoundException(`Product with serial number "${serial_number}" doesn't exist`);
    return removal;
  }

  async generateSerialNumber() {
    let random_serial_number: string;
    while (true) {
      random_serial_number = getRandomString(9);

      //check-in
      const existed_pr_with_this_token = await this.productRepository.findOne({ serial_number: random_serial_number });
      if (!existed_pr_with_this_token) break; // break if it's not exist
    }
    return {
      serial_number: random_serial_number,
    };
  }

  async getAllProduct(paginationDto: PaginationDto) {
    return this.productRepository.getAllProduct(paginationDto);
  }

  async getProduct(serial_number: string) {
    const prod = await this.productRepository.findOne({ serial_number });
    if (!prod) throw new NotFoundException(`Product with serial_number of "${serial_number} doesn't exist"`);
    return prod;
  }

  //
  // ─── BULK IMPORTATION ───────────────────────────────────────────────────────────
  //
  async BULK_createProduct(createProductBulkDTO: CreateProductBulkDTO) {
    const { importation_datas } = createProductBulkDTO;

    const valid_format = importation_datas.every((each: Object) => {
      if (each.hasOwnProperty('product_code') && each.hasOwnProperty('serial_number')) return true;
      return false;
    });
    if (!valid_format) return new BadRequestException(`Invalid format of the importation_datas`);

    const serial_number_lists = importation_datas.map((imp) => imp.serial_number);
    const duplicated_element = await this.productRepository.createQueryBuilder('prod').where('prod.serial_number IN (:...prod_list)', { prod_list: serial_number_lists }).getMany();

    const duplicated_lists = duplicated_element.map((dup) => dup.serial_number);

    if (duplicated_element.length) {
      return {
        success: false,
        code: 'duplication',
        duplicated_lists,
      };
    }

    const insertion_element = importation_datas.map((imp) => {
      const Prod = new Product();
      Prod.product_code = imp.product_code;
      Prod.serial_number = imp.serial_number;
      return Prod;
    });

    const bulk_insertion = await getConnection().createQueryBuilder().insert().into(Product).values(insertion_element).execute();
    return {
      success: true,
      insertion_list: bulk_insertion,
    };
  }
  // ─────────────────────────────────────────────────────────────────

  //SHARED
  async getProductById(id: number) {
    const prod = await this.productRepository.findOne({ id });
    if (!prod) throw new NotFoundException(`Product with id of "${id} doesn't exist"`);
    return prod;
  }

  async markProductPassTheQuailityChecked(id: number) {
    const prod = await this.productRepository.findOne({ id });
    prod.quality_passed = true;
    return await prod.save();
  }

  async markProductFailTheQuailityChecked(id: number) {
    const prod = await this.productRepository.findOne({ id });
    prod.quality_passed = false;
    return await prod.save();
  }

  // ────────────────────────────────────────────────────────────────────────────────
}

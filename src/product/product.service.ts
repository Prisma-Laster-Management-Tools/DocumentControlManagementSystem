import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/shared/dto/pagination/pagination.dto';
import { CreateProductDetailDTO } from './dto/create-product-detail.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDetailRepository } from './product-detail.repository';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductDetailRepository)
    private productDetailRepository: ProductDetailRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
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

  async getAllBaseProductDetail() {
    return await this.productDetailRepository.find();
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

  async getAllProduct(paginationDto: PaginationDto) {
    return this.productRepository.getAllProduct(paginationDto);
  }

  async getProduct(serial_number: string) {
    const prod = await this.productRepository.findOne({ serial_number });
    if (!prod) throw new NotFoundException(`Product with serial_number of "${serial_number} doesn't exist"`);
    return prod;
  }

  //SHARED
  async getProductById(id: number) {
    const prod = await this.productRepository.findOne({ id });
    if (!prod) throw new NotFoundException(`Product with id of "${id} doesn't exist"`);
    return prod;
  }

  // ────────────────────────────────────────────────────────────────────────────────
}

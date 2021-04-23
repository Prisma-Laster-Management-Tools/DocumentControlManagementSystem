import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async createBaseProductDetail(
    createProductDetailDTO: CreateProductDetailDTO,
  ) {
    return this.productDetailRepository.createBaseProductDetail(
      createProductDetailDTO,
    );
  }
  // ────────────────────────────────────────────────────────────────────────────────

  async createProduct(createProductDTO: CreateProductDTO) {
    //check phase
    const { product_code } = createProductDTO;
    const product = await this.productDetailRepository.findOne({
      product_code,
    });
    if (!product)
      throw new BadRequestException(
        `Product Code of "${product_code}" doesn't exist in database`,
      );
    // ─────────────────────────────────────────────────────────────────
    return this.productRepository.createProduct(createProductDTO);
  }

  async getAllProduct(paginationDto: PaginationDto) {
    return this.productRepository.getAllProduct(paginationDto);
  }

  async getProduct(serial_number: string) {
    const prod = await this.productRepository.findOne({ serial_number });
    if (!prod)
      throw new NotFoundException(
        `Product with serial_number of "${serial_number} doesn't exist"`,
      );
    return prod;
  }
}

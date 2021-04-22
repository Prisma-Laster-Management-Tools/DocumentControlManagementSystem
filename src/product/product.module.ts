import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailRepository } from './product-detail.repository';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository, ProductDetailRepository]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

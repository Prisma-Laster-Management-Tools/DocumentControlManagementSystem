import { Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateProductManufacturingShippingDTO {
  @IsString()
  @IsNotEmpty()
  product_code: string;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsNumber()
  @IsNotEmpty()
  total_products: number; // total_prod_count

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  buyer_name: string;

  @IsString()
  @IsOptional()
  buyer_contact: string;
}

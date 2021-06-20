import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateProductDetailDTO {
  @IsString()
  @IsNotEmpty()
  product_code: string;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  product_description: string;

  @IsString()
  @IsOptional()
  images_path: string | null;
}

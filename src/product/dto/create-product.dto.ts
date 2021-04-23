import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDate,
  IsDateString,
  IsString,
} from 'class-validator';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  serial_number: string;

  @IsString()
  @IsNotEmpty()
  product_code: string;
}

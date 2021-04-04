import {
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDate,
  IsDateString,
} from 'class-validator';

export class CreateSalesDataDTO {
  @IsNotEmpty()
  product_name: string;

  @IsNotEmpty()
  serial_number: string;

  @IsNotEmpty()
  customer_name: string;

  @IsDateString()
  @IsNotEmpty()
  issued_at: Date;

  @IsNotEmpty()
  price: number;
}

import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreatePurchasementRequestDTO {
  @IsString()
  @IsNotEmpty()
  commercial_number: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  is_special_request: boolean = false;

  @IsString()
  @IsOptional()
  special_part_name: string;

  @IsString()
  @IsOptional()
  special_part_contact: string;
}

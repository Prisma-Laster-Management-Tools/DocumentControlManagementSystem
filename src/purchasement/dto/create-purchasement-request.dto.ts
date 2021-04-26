import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePurchasementRequestDTO {
  @IsString()
  @IsNotEmpty()
  commercial_number: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

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

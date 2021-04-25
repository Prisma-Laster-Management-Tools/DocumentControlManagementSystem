import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreatePurchasementPartDetailDTO {
  @IsString()
  @IsNotEmpty()
  part_number: string;

  @IsString()
  @IsNotEmpty()
  part_name: string;

  @IsString()
  @IsOptional()
  part_description: string;
}

import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreatePurchasementSourceDTO {
  @IsString()
  @IsNotEmpty()
  part_number: string;

  @IsString()
  @IsNotEmpty()
  company: string; // could be create the another table that contains the partner-company credentials

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  seller: string;
}

import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateProtocalForProductDTO {
  @IsString()
  @IsNotEmpty()
  product_code: string; // can be the one that would be existed in the future -> PLANNING-QCING

  @IsNumber()
  @IsNotEmpty()
  process_order: number; // 1,2,3,4,5

  @IsString()
  @IsNotEmpty()
  process_description: string; // desc

  @IsBoolean()
  @IsNotEmpty()
  required_attachment: boolean = false;

  @IsString()
  @IsOptional()
  attachment_path: string;
}

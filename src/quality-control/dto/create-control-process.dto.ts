import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateControlProcess {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsNumber()
  @IsNotEmpty()
  protocol_id: number;

  @IsBoolean()
  @IsNotEmpty()
  check_status: boolean;
}

import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateQCQueueDTO {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;
}

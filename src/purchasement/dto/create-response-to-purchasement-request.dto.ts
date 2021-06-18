import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateResponseToPurchasementRequest {
  @IsBoolean()
  @IsNotEmpty()
  accept: boolean;
}

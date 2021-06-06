import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateAlreadyUsedFlaggedDTO {
  @IsString()
  @IsNotEmpty()
  access_token: string;
}

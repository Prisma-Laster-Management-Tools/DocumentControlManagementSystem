import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsDate, IsDateString, IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateRegistrationWithTokenDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}

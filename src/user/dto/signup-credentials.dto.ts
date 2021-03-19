import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

//@NOTE -> confirm password should be done on the front-end sided
export class SignUpCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(50)
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}

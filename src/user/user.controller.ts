import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {}

  @Post('registration')
  signUp(
    @Body()
    signUpCredentialDto: SignUpCredentialsDto,
  ) {
    return this.userService.signUp(signUpCredentialDto);
  }

  @Post('/login')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: SignUpCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authenticationService.signIn(authCredentialsDto);
  }
}

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

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('registration')
  signUp(
    @Body()
    signUpCredentialDto: SignUpCredentialsDto,
  ) {
    return this.userService.signUp(signUpCredentialDto);
  }
}

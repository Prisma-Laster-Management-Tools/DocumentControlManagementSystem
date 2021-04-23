import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService, private authenticationService: AuthenticationService) {}

  @Post('registration')
  signUp(
    @Body()
    signUpCredentialDto: SignUpCredentialsDto,
  ) {
    return this.userService.signUp(signUpCredentialDto);
  }

  @Post('/login')
  @HttpCode(200)
  signIn(@Body(ValidationPipe) authCredentialsDto: SignUpCredentialsDto): Promise<{ accessToken: string }> {
    return this.authenticationService.signIn(authCredentialsDto);
  }

  // This method would be available throughout the development phase only [WILL BE REMOVED later]
  @Get('/getmydata')
  @UseGuards(AuthGuard())
  getMyData(@GetUser() user) {
    return user;
  }
}

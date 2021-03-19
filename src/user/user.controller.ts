import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('registration')
  signUp() {
    return this.userService.signUp();
  }
}

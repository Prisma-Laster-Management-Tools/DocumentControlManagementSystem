import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './model/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signUp() {
    return { msg: 'ok' };
  }
}

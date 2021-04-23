import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EntityRepository, Repository } from 'typeorm';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './model/user.entity';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger();

  async signUp(signUpCredentialDto: SignUpCredentialsDto): Promise<any> {
    const { email, password } = signUpCredentialDto;
    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.position = 'super'; // TODO change this later when we know where to adjust user position
    try {
      await user.save();
      return { success: true };
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialDto: SignUpCredentialsDto): Promise<any> {
    const { email, password } = authCredentialDto;
    const user = await this.findOne({ email });
    if (user && (await user.validatePassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}

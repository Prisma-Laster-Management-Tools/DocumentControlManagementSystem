import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateRegistrationWithTokenDTO } from 'src/recruitment/dto/create-registration-with-token.dto';
import { Recruitment } from 'src/recruitment/model/recruitment.entity';

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

  async validateUserPassword(authCredentialDto: SignUpCredentialsDto): Promise<User | null> {
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

  //
  // ─── CO OP WITH RECRUITMENT ─────────────────────────────────────────────────────
  //
  async signUpWithLegitWay(recruitmentData: Recruitment, createRegistrationWithTokenDTO: CreateRegistrationWithTokenDTO) {
    const { email, password } = createRegistrationWithTokenDTO;
    const user = new User();
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    user.position = recruitmentData.role; // NOTE role means position -> related the same [i am lazy to changed it right now]
    user.firstname = recruitmentData.firstname;
    user.lastname = recruitmentData.lastname;
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
  // ────────────────────────────────────────────────────────────────────────────────
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRegistrationWithTokenDTO } from 'src/recruitment/dto/create-registration-with-token.dto';
import { Recruitment } from 'src/recruitment/model/recruitment.entity';
import { SignUpCredentialsDto } from './dto/signup-credentials.dto';
import { User } from './model/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository) {}

  async signUp(signUpCredentialDto: SignUpCredentialsDto) {
    return this.userRepository.signUp(signUpCredentialDto);
  }

  // CO-OP WITH THE RECRUITMENT MODULE
  async signUpWithLegitWay(recruitmentData: Recruitment, createRegistrationWithTokenDTO: CreateRegistrationWithTokenDTO) {
    const creation = await this.userRepository.signUpWithLegitWay(recruitmentData, createRegistrationWithTokenDTO);
    return creation;
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

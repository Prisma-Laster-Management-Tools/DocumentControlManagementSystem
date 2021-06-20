import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpCredentialsDto } from 'src/user/dto/signup-credentials.dto';
import { UserRepository } from 'src/user/user.repository';
import { JwtPayload } from './strategies/jwt.payload';

@Injectable()
export class AuthenticationService {
  constructor(@InjectRepository(UserRepository) private userRepository: UserRepository, private jwtService: JwtService) {}

  async signIn(signUpCredentialsDto: SignUpCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.validateUserPassword(signUpCredentialsDto);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { email: user.email, firstname: user.firstname, lastname: user.lastname, position: user.position, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}

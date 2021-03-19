import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { AuthenticationService } from './authentication.service';
import {
  modules_importation,
  JWTSExportationModules,
  JwtStrategy,
} from './strategies/jwt.strategy';

@Module({
  imports: [...modules_importation, TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthenticationService, JwtStrategy],
  exports: [...JWTSExportationModules], // passport module
})
export class AuthenticationModule {}

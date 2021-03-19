import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

//
// ─── DB ─────────────────────────────────────────────────────────────────────────
//
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
// ────────────────────────────────────────────────────────────────────────────────
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    UserModule,
  ],
})
export class AppModule {}

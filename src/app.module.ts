import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';

//
// ─── DB ─────────────────────────────────────────────────────────────────────────
//
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { SalesModule } from './sales/sales.module';
import { FeedbackModule } from './feedback/feedback.module';
// ────────────────────────────────────────────────────────────────────────────────
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthenticationModule,
    UserModule,
    SalesModule,
    FeedbackModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { SalesRepository } from 'src/sales/sales.repository';
import { SalesService } from 'src/sales/sales.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedbackRepository, SalesRepository]),
    AuthenticationModule, // needed because if we want to use the AuthGurad decorator from passport module!!!
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, SalesService],
  exports: [FeedbackService],
})
export class FeedbackModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesRepository } from 'src/sales/sales.repository';
import { SalesService } from 'src/sales/sales.service';
import { FeedbackController } from './feedback.controller';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackRepository, SalesRepository])],
  controllers: [FeedbackController],
  providers: [FeedbackService, SalesService],
})
export class FeedbackModule {}

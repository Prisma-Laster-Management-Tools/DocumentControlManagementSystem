import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackModule } from 'src/feedback/feedback.module';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalesRepository]), FeedbackModule],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}

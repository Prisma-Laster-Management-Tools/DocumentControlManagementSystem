import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecruitmentController } from './recruitment.controller';
import { RecruitmentRepository } from './recruitment.repository';
import { RecruitmentService } from './recruitment.service';

@Module({
  imports: [TypeOrmModule.forFeature([RecruitmentRepository])],
  controllers: [RecruitmentController],
  providers: [RecruitmentService],
})
export class RecruitmentModule {}

import { Controller, Get } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private recruitmentService: RecruitmentService) {}

  @Get()
  getAllRecruitments() {
    return this.recruitmentService.getAllRecruitments();
  }
}

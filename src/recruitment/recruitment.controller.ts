import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRecruitmentRegistrationSessionDTO } from './dto/create-recruitment-registration-session.dto';
import { RecruitmentService } from './recruitment.service';

@Controller('recruitment')
export class RecruitmentController {
  constructor(private recruitmentService: RecruitmentService) {}

  @Get()
  getAllRecruitments() {
    return this.recruitmentService.getAllRecruitments();
  }

  @Post()
  async generateRecruitmentRegistrationSession(@Body() createRecruitmentRegistrationSessionDTO: CreateRecruitmentRegistrationSessionDTO) {
    return this.recruitmentService.generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO);
  }

  @Get('/verify/:access_token')
  async verifyRecruitmentAccessToken(@Param('access_token') access_token: string) {
    return this.recruitmentService.verifyRecruitmentAccessToken(access_token);
  }
}

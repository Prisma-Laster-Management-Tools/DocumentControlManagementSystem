import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateAlreadyUsedFlaggedDTO } from './dto/create-already-used-flagged.dto';
import { CreateRecruitmentRegistrationSessionDTO } from './dto/create-recruitment-registration-session.dto';
import { CreateRegistrationWithTokenDTO } from './dto/create-registration-with-token.dto';
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

  @Post('/token/flagging')
  async setTokenAsAlreadyUsed(@Body() createAlreadyUsedFlaggedDTO: CreateAlreadyUsedFlaggedDTO) {
    return this.recruitmentService.TEST_setTokenAsAlreadyUsed(createAlreadyUsedFlaggedDTO);
  }

  @Delete('/token/:id')
  async removeRecruitmentToken(@Param('id', ParseIntPipe) id: number) {
    return this.recruitmentService.removeRecruitmentToken(id);
  }

  @Post('/registration')
  async registerWithAccessToken(@Body() createRegistrationWithTokenDTO: CreateRegistrationWithTokenDTO) {
    return this.recruitmentService.registerWithAccessToken(createRegistrationWithTokenDTO);
  }
}

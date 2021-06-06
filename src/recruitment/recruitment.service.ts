import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRecruitmentRegistrationSessionDTO } from './dto/create-recruitment-registration-session.dto';
import { RecruitmentRepository } from './recruitment.repository';

@Injectable()
export class RecruitmentService {
  constructor(@InjectRepository(RecruitmentRepository) private recruitmentRepository: RecruitmentRepository) {}
  async getAllRecruitments() {
    return await this.recruitmentRepository.find();
  }

  async generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO: CreateRecruitmentRegistrationSessionDTO) {
    return this.recruitmentRepository.generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO);
  }
}

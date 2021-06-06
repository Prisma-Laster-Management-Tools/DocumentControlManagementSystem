import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecruitmentRepository } from './recruitment.repository';

@Injectable()
export class RecruitmentService {
  constructor(@InjectRepository(RecruitmentRepository) private recruitmentRepository: RecruitmentRepository) {}
  async getAllRecruitments() {
    return await this.recruitmentRepository.find();
  }
}

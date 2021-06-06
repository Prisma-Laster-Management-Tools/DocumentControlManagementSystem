import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAlreadyUsedFlaggedDTO } from './dto/create-already-used-flagged.dto';
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

  async verifyRecruitmentAccessToken(access_token: string) {
    const Rm = await this.recruitmentRepository.findOne({ access_token });
    if (!Rm) throw new NotFoundException();
    return Rm;
  }

  async TEST_setTokenAsAlreadyUsed(createAlreadyUsedFlaggedDTO: CreateAlreadyUsedFlaggedDTO) {
    const Rm = await this.recruitmentRepository.findOne({ access_token: createAlreadyUsedFlaggedDTO.access_token, already_used: false });
    if (!Rm) return;
    // already flagged if the rm is still exist
    Rm.already_used = true;
    return await Rm.save();
  }

  //
  // ─── SHARED ─────────────────────────────────────────────────────────────────────
  //

  async setTokenAsAlreadyUsed(access_token: string) {
    const Rm = await this.recruitmentRepository.findOne({ access_token, already_used: false });
    if (!Rm) return;
    // already flagged if the rm is still exist
    Rm.already_used = true;
    return await Rm.save();
  }
  // ────────────────────────────────────────────────────────────────────────────────
}

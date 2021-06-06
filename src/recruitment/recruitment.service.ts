import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { CreateAlreadyUsedFlaggedDTO } from './dto/create-already-used-flagged.dto';
import { CreateRecruitmentRegistrationSessionDTO } from './dto/create-recruitment-registration-session.dto';
import { CreateRegistrationWithTokenDTO } from './dto/create-registration-with-token.dto';
import { RecruitmentRepository } from './recruitment.repository';

@Injectable()
export class RecruitmentService {
  constructor(@InjectRepository(RecruitmentRepository) private recruitmentRepository: RecruitmentRepository, private userService: UserService) {}
  async getAllRecruitments() {
    return await this.recruitmentRepository.find();
  }

  async generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO: CreateRecruitmentRegistrationSessionDTO) {
    return this.recruitmentRepository.generateRecruitmentRegistrationSession(createRecruitmentRegistrationSessionDTO);
  }

  async verifyRecruitmentAccessToken(access_token: string) {
    const Rm = await this.recruitmentRepository.findOne({ access_token, already_used: false });
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

  //
  // ─── USEREND ────────────────────────────────────────────────────────────────────
  //
  async registerWithAccessToken(createRegistrationWithTokenDTO: CreateRegistrationWithTokenDTO) {
    const { access_token } = createRegistrationWithTokenDTO;
    const Rm = await this.verifyRecruitmentAccessToken(access_token);
    if (!Rm) return; // indeed awareness hahahahahah
    const creation_request = await this.userService.signUpWithLegitWay(Rm, createRegistrationWithTokenDTO);
    if (creation_request.success) {
      // flagged token as used
      await this.setTokenAsAlreadyUsed(access_token);
      return { success: true };
    }
  }
  // ─────────────────────────────────────────────────────────────────
}

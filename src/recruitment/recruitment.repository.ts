import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { Recruitment } from './model/recruitment.entity';
@EntityRepository(Recruitment)
export class RecruitmentRepository extends Repository<Recruitment> {
  private logger = new Logger();
}

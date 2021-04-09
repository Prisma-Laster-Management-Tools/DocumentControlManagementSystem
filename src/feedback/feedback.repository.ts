import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { Feedback } from './model/feedback.entity';
@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  private logger = new Logger();
}

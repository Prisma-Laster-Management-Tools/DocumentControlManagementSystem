import { ConflictException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';

import { EntityRepository, Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { Feedback } from './model/feedback.entity';
@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  private logger = new Logger();

  findAll() {
    const query = this.createQueryBuilder('feedback').leftJoinAndSelect('feedback.sales', 'sales').select(['feedback.id', 'feedback.feedback_str']).addSelect(['sales.customer_name', 'sales.id']);
    return query.getMany();
  }

  async createFeedback(createFeedbackDTO: CreateFeedbackDTO, SaleEntity: Sales) {
    const { feedback_str } = createFeedbackDTO;
    const feedback = new Feedback();
    feedback.feedback_str = feedback_str;
    feedback.sales = SaleEntity;
    return await feedback.save();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesService } from 'src/sales/sales.service';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackRepository } from './feedback.repository';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(FeedbackRepository)
    private feedbackRepository: FeedbackRepository,
    private salesService: SalesService,
  ) {}

  findAll() {
    return this.feedbackRepository.findAll();
  }
  55;

  async createFeedback(createFeedbackDTO: CreateFeedbackDTO, sales_id: number) {
    const SaleEntity = await this.salesService.findSales(sales_id); // getting if the entity exist (cross-service)
    return this.feedbackRepository.createFeedback(
      createFeedbackDTO,
      SaleEntity,
    );
  }

  async removeFeedback(sales_id: number) {
    const removal = await this.feedbackRepository.delete({
      sales: { id: sales_id },
    });
    if (!removal.affected)
      throw new NotFoundException(
        `SalesId of "${sales_id}" doesn't even have any feedback`,
      );

    return removal;
  }
}

import { Injectable } from '@nestjs/common';
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

  async createFeedback(createFeedbackDTO: CreateFeedbackDTO, sales_id: number) {
    const SaleEntity = await this.salesService.findSales(sales_id); // getting if the entity exist (cross-service)
    console.log(SaleEntity);
    return this.feedbackRepository.createFeedback(
      createFeedbackDTO,
      SaleEntity,
    );
  }
}

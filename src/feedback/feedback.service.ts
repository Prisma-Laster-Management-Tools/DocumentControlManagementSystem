import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SalesService } from 'src/sales/sales.service';
import { getRandomString } from 'src/utilities/random/string';
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
    return this.feedbackRepository.createFeedback(createFeedbackDTO, SaleEntity);
  }

  async createFeedbackAccessLinkToken(sales_id: number) {
    //const feedback = await this.feedbackRepository.findOne({ sales: { id: sales_id } });
    //if (!feedback) throw new NotFoundException(`SalesId of "${sales_id}" doesn't even have any feedback`);
    const SaleEntity = await this.salesService.findSales(sales_id);
    let random_access_token;
    while (true) {
      random_access_token = getRandomString(10);

      //check-in
      const existed_feedback = await this.feedbackRepository.findOne({ access_token: random_access_token });
      if (!existed_feedback) break; // break if it's not exist
    }
    // ─────────────────────────────────────────────────────────────────
    return this.feedbackRepository.createFeedbackAccessLinkToken(random_access_token, sales_id);
  }

  async removeFeedback(sales_id: number) {
    const removal = await this.feedbackRepository.delete({
      sales: { id: sales_id },
    });
    if (!removal.affected) throw new NotFoundException(`SalesId of "${sales_id}" doesn't even have any feedback`);

    return removal;
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async verifyFeedbackAccessToken(token: string) {
    const feedback = await this.feedbackRepository.createQueryBuilder('feedback').leftJoinAndSelect('feedback.sales', 'sales').getMany(); // TODO add where cluases
    if (!feedback) throw new NotFoundException();
    return feedback;
  }

  async createFeedback(createFeedbackDTO: CreateFeedbackDTO, sales_id: number) {
    const SaleEntity = await this.salesService.findSales(sales_id); // getting if the entity exist (cross-service)

    // Check if the token is valid or not
    const { access_token, feedback_str, delivery_rating_score, quality_rating_score, service_rating_score, worthiness_rating_score } = createFeedbackDTO;
    //const Feedback = await this.feedbackRepository.findOne({ access_token });
    const Feedback = await this.feedbackRepository.createQueryBuilder('feedback').leftJoinAndSelect('feedback.sales', 'sales').where('access_token=:access_token', { access_token }).getOne();
    if (!Feedback) throw new BadRequestException(`Token is invalid`);
    // check if the sale id is the same of the fetched one
    if (Feedback.sales.id !== sales_id) throw new BadRequestException(`Token is invalid`);
    // ─────────────────────────────────────────────────────────────────
    Feedback.feedback_str = feedback_str;
    Feedback.sales = SaleEntity;
    Feedback.quality_rating_score = quality_rating_score;
    Feedback.service_rating_score = service_rating_score;
    Feedback.worthiness_rating_score = worthiness_rating_score;
    Feedback.delivery_rating_score = delivery_rating_score;
    return await Feedback.save();
    //return this.feedbackRepository.createFeedback(createFeedbackDTO, SaleEntity);
  }

  async getFeedback(id: number) {
    const SaleEntity = await this.salesService.findSales(id);
    const Feedback = await this.feedbackRepository.findOne({ sales: { id } });
    if (!Feedback) throw new NotFoundException(`SalesId of "${id}" doesn't even have any feedback`);
    return Feedback;
  }

  async createFeedbackAccessLinkToken(sales_id: number) {
    const feedback = await this.feedbackRepository.findOne({ sales: { id: sales_id } });
    if (feedback) return feedback; // if already exist show the same
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

import { Controller, Get } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Feedback } from './model/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}
  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }
}

import { Body, Controller, Get, Post, Session } from '@nestjs/common';
import { ISessionItems } from 'src/@types/session';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { Feedback } from './model/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}
  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Post()
  createFeedback(
    @Body() createFeedbackDTO: CreateFeedbackDTO,
    @Session() session: ISessionItems,
  ) {
    const { feedback_id } = session.param_cached;
    return this.feedbackService.createFeedback(createFeedbackDTO, feedback_id);
  }
}

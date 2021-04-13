import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Post,
  Session,
} from '@nestjs/common';
import { ISessionItems } from 'src/@types/session';
import { SESSION_ExtractDataAndClear } from 'src/shared/helpers/Session';
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

  /**
   * @ACCESS <REDIRECTION ONLY>
   */
  @Post()
  createFeedback(
    @Body() createFeedbackDTO: CreateFeedbackDTO,
    @Session() session: ISessionItems,
  ) {
    const { feedback_id } = session.param_cached; // it's not feedback id -> change to sales_id later
    delete session.param_cached;
    return this.feedbackService.createFeedback(createFeedbackDTO, feedback_id);
  }

  /**
   * @ACCESS <REDIRECTION ONLY>
   */
  @Get('/removal')
  removeFeedback(@Session() session: ISessionItems) {
    const { sales_id } = SESSION_ExtractDataAndClear(session, 'param_cached');
    if (!sales_id) throw new NotAcceptableException();
    return this.feedbackService.removeFeedback(sales_id);
  }
}

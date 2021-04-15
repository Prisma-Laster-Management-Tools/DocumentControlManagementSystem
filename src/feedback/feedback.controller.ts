import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ISessionItems } from 'src/@types/session';
import { Positions } from 'src/shared/guards/position/positions.decorator';
import { PositionsGuard } from 'src/shared/guards/position/positions.guard';
import { SESSION_ExtractDataAndClear } from 'src/shared/helpers/Session';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { Feedback } from './model/feedback.entity';

@Controller('feedback')
@UseGuards(AuthGuard(), PositionsGuard)
@Positions('purchasement') // Only user with purchasement role can access this [ TESTING ]
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
    const { sales_id } = SESSION_ExtractDataAndClear(session, 'param_cached');
    if (!sales_id) throw new NotAcceptableException();
    return this.feedbackService.createFeedback(createFeedbackDTO, sales_id);
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

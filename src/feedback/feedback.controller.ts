import { Body, Controller, Delete, Get, NotAcceptableException, Param, ParseIntPipe, Post, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ISessionItems } from 'src/@types/session';
import { Positions } from 'src/shared/guards/position/positions.decorator';
import { PositionsGuard } from 'src/shared/guards/position/positions.guard';
import { SESSION_ExtractDataAndClear } from 'src/shared/helpers/Session';
import { CreateFeedbackDTO } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
import { Feedback } from './model/feedback.entity';

@Controller('feedback')
@UseGuards(PositionsGuard)
@Positions('purchasement') // Only user with purchasement role can access this [ TESTING ]
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}
  @Get()
  @UseGuards(AuthGuard())
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  /**
   * @ACCESS Public
   */
  @Get('/verify/:access_token')
  verifyFeedbackAccessToken(@Param('access_token') access_token: string) {
    return this.feedbackService.verifyFeedbackAccessToken(access_token);
  }

  /**
   * @ACCESS <REDIRECTION ONLY>
   */
  @Post()
  @UseGuards(AuthGuard())
  createFeedback(@Body() createFeedbackDTO: CreateFeedbackDTO, @Session() session: ISessionItems) {
    const { sales_id } = SESSION_ExtractDataAndClear(session, 'param_cached');
    if (!sales_id) throw new NotAcceptableException();
    return this.feedbackService.createFeedback(createFeedbackDTO, sales_id);
  }

  @Get('/:id')
  getFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.feedbackService.getFeedback(id);
  }

  /**
   * @ACCESS <REDIRECTION ONLY>
   */
  @Get('/create-feedback-access-link')
  @UseGuards(AuthGuard())
  createFeedbackAccessLinkToken(@Session() session: ISessionItems) {
    const { sales_id } = SESSION_ExtractDataAndClear(session, 'param_cached');
    if (!sales_id) throw new NotAcceptableException();
    return this.feedbackService.createFeedbackAccessLinkToken(sales_id);
  }

  /**
   * @ACCESS <REDIRECTION ONLY>
   */
  @Get('/removal')
  @UseGuards(AuthGuard())
  removeFeedback(@Session() session: ISessionItems) {
    const { sales_id } = SESSION_ExtractDataAndClear(session, 'param_cached');
    if (!sales_id) throw new NotAcceptableException();
    return this.feedbackService.removeFeedback(sales_id);
  }
}

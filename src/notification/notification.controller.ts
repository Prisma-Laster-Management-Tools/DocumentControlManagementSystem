import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { ResponseMsg } from 'src/shared/helpers/ResponseMsg';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findAll(@GetUser() user) {
    return ResponseMsg.success(await this.notificationService.findAll(user));
  }

  @Post()
  async createNotification(
    @Body() createNotificationDTO: CreateNotificationDTO,
  ) {
    return ResponseMsg.success(
      await this.notificationService.createNotification(createNotificationDTO),
    );
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/model/user.entity';
import { Notification } from './model/notification.entity';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    private notificationRepository: NotificationRepository,
  ) {}

  async findAll(user: User): Promise<Notification[]> {
    return this.notificationRepository.findAll(user);
  }
}

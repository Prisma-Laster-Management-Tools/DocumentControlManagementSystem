import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationGateway } from 'src/notification.gateway';
import { User } from 'src/user/model/user.entity';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { Notification } from './model/notification.entity';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRepository)
    public notificationRepository: NotificationRepository,
    private notificationGateway: NotificationGateway,
  ) {}

  async findAll(user: User): Promise<Notification[]> {
    return this.notificationRepository.findAll(user);
  }

  async createNotification(createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
    const emitToPeer = (data: any) => {
      this.notificationGateway.sendNotificationMessage(data);
    };
    return this.notificationRepository.createNotification(createNotificationDTO, emitToPeer);
  }
}

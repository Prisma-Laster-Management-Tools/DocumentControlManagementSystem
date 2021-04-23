import { Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { User } from 'src/user/model/user.entity';

import { EntityRepository, Repository } from 'typeorm';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { Notification } from './model/notification.entity';
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  private logger = new Logger();
  //TODO support for multiple related position like [a,b,c] format -> checking if string includes instead of equaling it
  async findAll(user: User) {
    return this.find({
      where: [{ related_positions: null }, { related_positions: user.position }],
    });
  }

  async createNotification(createNotificationDTO: CreateNotificationDTO): Promise<Notification> {
    const { attached_params = '', message = '', related_positions = null } = createNotificationDTO;
    const NotificationInstsance = new Notification();
    NotificationInstsance.message = message;
    NotificationInstsance.related_positions = related_positions;
    NotificationInstsance.attached_params = attached_params;
    return await NotificationInstsance.save();
  }
}

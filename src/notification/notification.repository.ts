import { Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';
import { User } from 'src/user/model/user.entity';

import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './model/notification.entity';
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  private logger = new Logger();
  //TODO support for multiple related position like [a,b,c] format -> checking if string includes instead of equaling it
  async findAll(user: User) {
    return this.find({
      where: [
        { related_positions: null },
        { related_positions: user.position },
      ],
    });
  }
}

import { Logger } from '@nestjs/common';
import { Sales } from 'src/sales/model/sales.entity';

import { EntityRepository, Repository } from 'typeorm';
import { Notification } from './model/notification.entity';
@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  private logger = new Logger();
}

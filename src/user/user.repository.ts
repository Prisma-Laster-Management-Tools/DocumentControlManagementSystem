import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './model/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  private logger = new Logger();
}

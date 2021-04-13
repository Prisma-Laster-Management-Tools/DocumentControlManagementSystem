import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { Feedback } from 'src/feedback/model/feedback.entity';

@Entity()
export class Sales extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_name: string;

  @Column()
  serial_number: string;

  @Column()
  customer_name: string;

  @Column()
  issued_at: Date;

  @Column()
  price: number;

  @OneToMany((type) => Feedback, (feedback) => feedback.sales, { eager: true })
  feedback: Feedback;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

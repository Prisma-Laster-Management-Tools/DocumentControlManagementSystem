import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

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

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

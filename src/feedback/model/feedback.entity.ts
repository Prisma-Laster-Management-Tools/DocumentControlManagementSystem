import { Sales } from 'src/sales/model/sales.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   product_name: string;

  //   @Column()
  //   serial_number: string;

  @ManyToOne((type) => Sales, (sales) => sales.id, { eager: false })
  sales: Sales;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

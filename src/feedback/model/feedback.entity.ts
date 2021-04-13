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
@Unique(['sales']) // 1 Sale can only have 1 feedback
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //   @Column()
  //   product_name: string;

  //   @Column()
  //   serial_number: string;

  @Column()
  feedback_str: string;

  @ManyToOne((type) => Sales, (sales) => sales.id, { eager: false })
  sales: Sales;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

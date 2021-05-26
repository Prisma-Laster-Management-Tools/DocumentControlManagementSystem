import { Sales } from 'src/sales/model/sales.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['sales']) // 1 Sale can only have 1 feedback
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quality_rating_score: number;

  @Column()
  worthiness_rating_score: number;

  @Column()
  delivery_rating_score: number;

  @Column()
  service_rating_score: number;

  @Column()
  feedback_str: string;

  @ManyToOne((type) => Sales, (sales) => sales.id, { eager: false })
  sales: Sales;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

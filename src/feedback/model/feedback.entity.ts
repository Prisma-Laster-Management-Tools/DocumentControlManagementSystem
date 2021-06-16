import { Sales } from 'src/sales/model/sales.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['sales']) // 1 Sale can only have 1 feedback
export class Feedback extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  quality_rating_score: number;

  @Column({ nullable: true })
  worthiness_rating_score: number;

  @Column({ nullable: true })
  delivery_rating_score: number;

  @Column({ nullable: true })
  service_rating_score: number;

  @Column({ nullable: true })
  feedback_str: string;

  @Column()
  access_token: string; // might be encoded with JWT or whatever => recommend using jwt with the stamp expired date [or just generate the random link]

  @ManyToOne((type) => Sales, (sales) => sales.id, { eager: false, cascade: true, onDelete: 'CASCADE' }) // when sales got deleted -> this would be removed too
  sales: Sales;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

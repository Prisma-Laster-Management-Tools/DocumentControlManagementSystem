import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class QualityControlProtocol extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_code: string; // for which product code

  @Column()
  process_order: number;

  @Column()
  process_description: string;

  @Column({ default: false })
  required_attachment: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

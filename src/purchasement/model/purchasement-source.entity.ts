import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class PurchasementSource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  part_number: string;

  @Column()
  company: string;

  @Column()
  email: string;

  @Column()
  seller: string; // people who sells this part to our company

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

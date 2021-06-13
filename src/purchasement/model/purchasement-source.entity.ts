import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['commercial_number'])
export class PurchasementSource extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  commercial_number: string;

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

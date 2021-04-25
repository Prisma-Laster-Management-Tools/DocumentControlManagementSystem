import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class PurchasementPart extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  part_number: string;

  @Column()
  part_name: string;

  @Column({ nullable: true })
  part_description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

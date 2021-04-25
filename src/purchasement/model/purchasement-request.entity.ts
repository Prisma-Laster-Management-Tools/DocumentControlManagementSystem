import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class PurchasementRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  part_number: string;

  @Column()
  quantity: string; // 1ชิ้น , 1 กิโล , 1 อัน

  @Column({ default: false })
  is_special_request: boolean;

  @Column({ nullable: true })
  special_part_name: string; // custom part name

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class CalibrationEvidence extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  machine_name: string;

  @Column()
  serial_number: string;

  @Column({ nullable: true })
  description: string; // just a briefly instruction introduction to the maintenancer

  @Column({ nullable: true, default: null })
  attachments: string; // splits with comma [,]

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

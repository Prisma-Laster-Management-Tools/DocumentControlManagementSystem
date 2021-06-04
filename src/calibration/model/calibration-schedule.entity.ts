import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class CalibrationSchedule extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  machine_name: string;

  @Column()
  serial_number: string;

  @Column()
  instruction: string; // just a briefly instruction introduction to the maintenancer

  @Column()
  cycle_start_at: Date;

  @Column()
  cycle_info: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { CalibrationSchedule } from './calibration-schedule.entity';

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

  @Column({ default: false })
  is_pass: boolean;

  @Column({ nullable: true, default: null })
  attachments: string; // splits with comma [,]

  // NOTE createForeignKeyConstraints to allow having the calibration evidence with the not-exist serial_number in the cycle
  @ManyToOne((type) => CalibrationSchedule, { createForeignKeyConstraints: false, cascade: true, onDelete: 'CASCADE' }) // If CalibrationSchedule got removed -> remove all the evidence of it too
  @JoinColumn({ name: 'serial_number', referencedColumnName: 'serial_number' })
  calibration_schedule: CalibrationSchedule;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

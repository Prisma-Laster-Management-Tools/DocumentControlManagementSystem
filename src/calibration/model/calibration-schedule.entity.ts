import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { CalibrationEvidence } from './calibration-evidence.entity';

@Entity()
@Unique(['serial_number'])
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

  @OneToMany((type) => CalibrationEvidence, (calibration) => calibration.calibration_schedule, { eager: true }) // not by default
  calibration_evidence: CalibrationEvidence[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

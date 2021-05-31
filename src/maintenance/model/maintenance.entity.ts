import { Sales } from 'src/sales/model/sales.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class Maintenance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  machine_name: string;

  @Column()
  serial_number: string;

  @Column()
  statis: string;

  @Column()
  who: number; // maintenancer -> should be removed later

  @Column()
  instruction: string; // just a briefly instruction introduction to the maintenancer

  @Column()
  cycle_info: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

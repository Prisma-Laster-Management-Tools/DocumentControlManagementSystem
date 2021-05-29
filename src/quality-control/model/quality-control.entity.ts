import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { QualityControlProtocol } from './quality-control-protocol.entity';

@Entity()
export class QualityControl extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  serial_number: string;

  @Column()
  check_status: boolean;

  @ManyToOne((type) => QualityControlProtocol)
  @JoinColumn({ name: 'protocal_id', referencedColumnName: 'id' }) // using custom created column name instead of auto-generated -> protocalId
  protocol: QualityControlProtocol;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

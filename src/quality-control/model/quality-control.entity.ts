import { Product } from 'src/product/model/product.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { QualityControlProtocol } from './quality-control-protocol.entity';

@Entity()
export class QualityControl extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  group_code: string; // a random generated string to group a period of the qc

  // @Column()
  // serial_number: string;

  // If product got delete this will too -> cascade on
  @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true, onDelete: 'CASCADE' })
  product: Product;

  @Column()
  check_status: boolean;

  // @ManyToOne((type) => QualityControlProtocol)
  // @JoinColumn({ name: 'protocal_id', referencedColumnName: 'id' }) // using custom created column name instead of auto-generated -> protocalId
  // protocol: QualityControlProtocol;

  @ManyToOne((type) => QualityControlProtocol, (qcp) => qcp.id, { eager: true, cascade: true, onDelete: 'CASCADE' })
  //@JoinColumn({ name: 'protocal_id', referencedColumnName: 'id' }) // using custom created column name instead of auto-generated -> protocalId
  protocol: QualityControlProtocol;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

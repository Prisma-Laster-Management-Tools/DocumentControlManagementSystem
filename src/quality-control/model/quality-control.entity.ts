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

  // Support viewing the history if the protocol gets deleted in some point of time in the future
  @Column()
  protocol_description: string;
  @Column()
  number_of_protocol: number; // to store the number of protocol in the past [because it might be changed in the future so we should stamp it as well to check whether it has been validated as pass or failed ]
  // ────────────────────────────────────────────────────────────────────────────────

  @ManyToOne((type) => QualityControlProtocol, (qcp) => qcp.id, { eager: true, cascade: true, onDelete: 'CASCADE' })
  //@JoinColumn({ name: 'protocal_id', referencedColumnName: 'id' }) // using custom created column name instead of auto-generated -> protocalId
  protocol: QualityControlProtocol;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

import { QualityControlProtocol } from 'src/quality-control/model/quality-control-protocol.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity()
@Unique(['product_code'])
export class ProductDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  product_code: string; //sku

  @Column()
  product_name: string;

  @Column()
  product_description: string;

  @OneToMany((type) => QualityControlProtocol, (protocol) => protocol.product_detail, { eager: false }) // not by default
  protocol: QualityControlProtocol[];

  @OneToMany((type) => Product, (prod) => prod.product_detail, { eager: false })
  product_entity: Array<Product>;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

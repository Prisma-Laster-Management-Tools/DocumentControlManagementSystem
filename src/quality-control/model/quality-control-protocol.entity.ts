import { ProductDetail } from 'src/product/model/product-detail.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
export class QualityControlProtocol extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_code: string; // for which product code

  @Column()
  process_order: number;

  @Column()
  process_description: string;

  @Column({ default: false })
  required_attachment: boolean;

  @Column({ nullable: true, default: null })
  attachment_path: string;

  @ManyToOne((type) => ProductDetail)
  @JoinColumn({ name: 'product_code', referencedColumnName: 'product_code' })
  product_detail: ProductDetail;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}

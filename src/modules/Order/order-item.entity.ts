import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../Product/product.entity';

@Entity()
export class OrderItem {
  @PrimaryColumn()
  orderId: string;

  @PrimaryColumn()
  productId: string;

  @Column('decimal', { precision: 7, scale: 2 })
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems)
  product: Product;
}

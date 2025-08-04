import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../Product/product.entity';

@Entity()
export class CartItem {
  @PrimaryColumn()
  cartId: string;

  @PrimaryColumn()
  productId: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  product: Product;

  @CreateDateColumn()
  addedAt: Date;
}

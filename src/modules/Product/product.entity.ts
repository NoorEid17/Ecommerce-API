import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../Category/category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 7, scale: 2 }) // 1,000,000.00
  price: number;

  @Column({ type: 'int8' }) // Max
  stockQuantity: number;

  @Column()
  categoryId: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { CartService } from './cart.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem])],
  controllers: [],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

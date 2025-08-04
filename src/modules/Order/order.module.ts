import { Module } from '@nestjs/common';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../Cart/cart.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CartModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

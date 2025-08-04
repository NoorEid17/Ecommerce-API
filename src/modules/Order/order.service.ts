import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { CartService } from '../Cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  async createOrderFromUserCart(userId: string, shippingAddress: string) {
    const cart = await this.cartService.getUserCart(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new BadRequestException('Cart is empty or does not exist');
    }

    const newOrder = this.orderRepository.create({
      userId,
      totalAmount: 0,
      shippingAddress,
    });

    const order = await this.orderRepository.save(newOrder);

    cart.cartItems.forEach((item) => {
      const orderItem = this.orderItemRepository.create({
        orderId: order.id,
        productId: item.productId,
        price: item.product.price,
        quantity: item.quantity,
      });
      this.orderItemRepository.save(orderItem);
    });
    order.totalAmount = cart.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );

    await this.orderRepository.save(order);
    return order;
  }

  getOrderById(orderId: string) {
    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'user', 'items.product'],
    });
  }

  getUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'user'],
      order: { orderDate: 'DESC' },
    });
  }

  updateOrder(orderId: string, updateData: Partial<Order>) {
    return this.orderRepository.update(orderId, updateData);
  }

  deleteOrder(orderId: string): any {
    return this.orderRepository.delete(orderId);
  }
}

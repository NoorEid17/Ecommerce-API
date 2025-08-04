import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrderFromUserCart(
    @UserId() userId: string,
    @Body('shippingAddress') shippingAddress: string,
  ) {
    if (!shippingAddress) {
      throw new BadRequestException('Shipping address is required');
    }
    return this.orderService.createOrderFromUserCart(userId, shippingAddress);
  }

  @Get()
  async getUserOrders(@UserId() userId: string) {
    return this.orderService.getUserOrders(userId);
  }

  @Get(':id')
  async getOrderById(
    @UserId() userId: string,
    @Param('id', new ParseUUIDPipe()) orderId: string,
  ) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order || order.userId !== userId) {
      throw new BadRequestException(
        'Order not found or does not belong to user',
      );
    }
    return order;
  }
}

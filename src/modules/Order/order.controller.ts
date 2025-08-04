import {
  BadRequestException,
  Body,
  Controller,
  Get,
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
}

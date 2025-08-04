import { Controller, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getUserCart(@UserId() userId: string) {
    return this.cartService.getUserCart(userId);
  }
}

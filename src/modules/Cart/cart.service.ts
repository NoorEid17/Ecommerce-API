import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductService } from '../Product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productService: ProductService,
  ) {}

  getUserCart(userId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { userId },
      relations: ['cartItems', 'cartItems.product'],
    });
  }

  createCart(userId: string): Promise<Cart> {
    const cart = this.cartRepository.create({ userId });
    return this.cartRepository.save(cart);
  }

  async addItemToCart(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    const cart = await this.getUserCart(userId);
    if (!cart) {
      throw new BadRequestException('Cart not found for user');
    }
    const existingItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (existingItem) {
      throw new BadRequestException(
        'Item already exists in the cart. Use update method to change quantity.',
      );
    }
    const productExists = await this.productService.findOne({
      where: { id: productId },
    });
    if (!productExists) {
      throw new BadRequestException('Product does not exist');
    }
    if (productExists.stockQuantity < quantity) {
      throw new BadRequestException('Insufficient stock for product');
    }
    return this.cartItemRepository.save({
      cart,
      productId,
      quantity,
    });
  }

  async updateCartItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<CartItem> {
    const cart = await this.getUserCart(userId);
    if (!cart) {
      throw new BadRequestException('Cart not found for user');
    }
    const existingItem = cart.cartItems.find(
      (item) => item.productId === productId,
    );
    if (!existingItem) {
      throw new BadRequestException('Item does not exist in the cart');
    }
    if (quantity > existingItem.product.stockQuantity) {
      throw new BadRequestException('Insufficient stock for product');
    }
    existingItem.quantity = quantity;
    return this.cartItemRepository.save(existingItem);
  }
}

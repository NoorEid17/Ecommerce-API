import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CartService } from '../Cart/cart.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
  ) {}

  async create(data: Partial<User>) {
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    await this.cartService.createCart(newUser.id);
    return newUser;
  }

  async findOneBy(options: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(options);
  }
}

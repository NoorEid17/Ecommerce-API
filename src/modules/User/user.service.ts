import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CartService } from '../Cart/cart.service';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) {}

  async create(data: Partial<User>) {
    const newUser = this.userRepository.create(data);
    await this.userRepository.save(newUser);
    await this.cartService.createCart(newUser.id);
    return newUser;
  }

  async findOneBy(options: FindOptionsWhere<User>) {
    const user = await this.userRepository.findOneBy(options);
    if (user) delete user.password;
    return user;
  }

  async comparePassword(userId: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new BadRequestException('User not found');
    return bcrypt.compare(password, user.password);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    if (data.email) {
      const emailUsed = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (emailUsed && emailUsed.id !== id) {
        throw new ConflictException('Email is already in use');
      }
    }
    if (data.username) {
      const usernameUsed = await this.userRepository.findOneBy({
        username: data.username,
      });
      if (usernameUsed && usernameUsed.id !== id) {
        throw new ConflictException('Username is already in use');
      }
    }
    if (data.newPassword && !data.oldPassword) {
      throw new BadRequestException(
        'Old password is required for password change',
      );
    }
    if (data.newPassword && data.oldPassword) {
      const isPasswordValid = await this.comparePassword(id, data.oldPassword);
      if (!isPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }
      const BCRYPT_ROUNDS = +this.configService.get<number>(
        'BCRYPT_ROUNDS',
        10,
      );
      data['password'] = await bcrypt.hash(data.newPassword, BCRYPT_ROUNDS);
      delete data.newPassword;
      delete data.oldPassword;
    }
    await this.userRepository.update(id, data);
    const updatedUser = await this.userRepository.findOneBy({ id });
    delete updatedUser.password;
    return updatedUser;
  }
}

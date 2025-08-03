import { User } from './user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const newUser = this.userRepository.create(data);
    return this.userRepository.save(newUser);
  }

  async findOneBy(options: FindOptionsWhere<User>) {
    return this.userRepository.findOneBy(options);
  }
}

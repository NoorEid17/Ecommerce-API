import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  create(data: Partial<Category>) {
    const newCategory = this.categoryRepository.create(data);
    return this.categoryRepository.save(newCategory);
  }

  findAll(findOptions: FindManyOptions<Category> = {}) {
    return this.categoryRepository.find(findOptions);
  }

  findOneBy(options: FindOptionsWhere<Category>) {
    return this.categoryRepository.findOneBy(options);
  }
}

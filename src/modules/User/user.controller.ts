import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from '../../common/decorators/user-id.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@UserId() userId: string) {
    const user = await this.userService.findOneBy({ id: userId });
    return user;
  }
}

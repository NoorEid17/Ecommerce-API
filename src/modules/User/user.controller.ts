import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UserId } from '../../common/decorators/user-id.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@UserId() userId: string) {
    const user = await this.userService.findOneBy({ id: userId });
    return user;
  }

  @Patch('me')
  async updateMe(@UserId() userId: string, @Body() data: UpdateUserDto) {
    const updatedUser = await this.userService.updateUser(userId, data);
    return updatedUser;
  }
}

import { Module } from '@nestjs/common';
import { AuthModule } from '../Auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [AuthModule],
  exports: [],
  providers: [],
  controllers: [AdminController],
})
export class AdminModule {}

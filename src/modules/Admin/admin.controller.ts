import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AuthService } from '../Auth/auth.service';
import { Public } from '../../common/decorators/public.decorator';
import { LoginDto } from '../Auth/dto/login.dto';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Public()
  @Render('auth/login')
  login() {
    return { title: 'Admin Login' };
  }
}

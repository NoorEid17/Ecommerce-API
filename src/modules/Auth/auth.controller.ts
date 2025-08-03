import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '@/common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() registerData: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.register(registerData);

    res.cookie('refreshToken', refreshToken, {
      secure: false,
      sameSite: 'lax',
    });

    return {
      user,
      token: accessToken,
    };
  }

  @Public()
  @Post('login')
  async login(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.authService.login(
      loginData.email,
      loginData.password,
    );

    res.cookie('refreshToken', refreshToken, {
      secure: false,
      sameSite: 'lax',
    });

    return {
      user,
      token: accessToken,
    };
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No token Provided');
    }
    const payload = await this.authService
      .verifyToken(refreshToken)
      .catch(() => {
        throw new UnauthorizedException('Invalid Token');
      });
    const accessToken = await this.authService.generateToken({
      sub: payload.sub,
    });
    return {
      token: accessToken,
    };
  }
}

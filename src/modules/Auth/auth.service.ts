import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../User/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../User/user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateToken(payload: any, signOptions?: JwtSignOptions) {
    return this.jwtService.sign(payload, signOptions);
  }

  verifyToken(token: string) {
    return this.jwtService.verifyAsync(token);
  }

  async register(data: Partial<User>) {
    const emailUsed = await this.userService.findOneBy({ email: data.email });
    if (emailUsed) {
      throw new ConflictException('Email is already Used');
    }
    const usernameUsed = await this.userService.findOneBy({
      username: data.username,
    });
    if (usernameUsed) {
      throw new ConflictException('Username is already used!');
    }

    const BCRYPT_ROUNDS = +this.configService.get('BCRYPT_ROUNDS') || 10;
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await this.userService.create({
      ...data,
      password: passwordHash,
    });
    delete user.password;
    const tokenPayload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.generateToken(tokenPayload);
    const refreshToken = this.generateToken(tokenPayload, {
      expiresIn: '30d',
    });
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneBy({ email });
    if (!user) {
      throw new BadRequestException('Incorrect Username or password');
    }
    const isPasswordValid = await this.userService.comparePassword(
      user.id,
      password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect Username or password');
    }
    delete user.password;
    const tokenPayload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.generateToken(tokenPayload);
    const refreshToken = this.generateToken(tokenPayload, {
      expiresIn: '30d',
    });
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}

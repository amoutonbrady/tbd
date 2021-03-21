import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { User as IUser } from '@prisma/client';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../shared/user.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  me(@User() user: IUser) {
    return user;
  }

  @Post('signin')
  signIn(@Body() user: { email: string; password: string }) {
    return this.auth.signIn(user.email, user.password);
  }

  @Post('signup')
  signUp(@Body() user: { email: string; password: string }) {
    return this.auth.signUp(user.email, user.password);
  }
}

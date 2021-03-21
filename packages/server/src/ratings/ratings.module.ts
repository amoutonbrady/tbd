import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from '../shared/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, PrismaService, UsersService, AuthService],
})
export class RatingsModule {}

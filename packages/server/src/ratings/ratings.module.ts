import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { PrismaService } from '../shared/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { CitiesService } from '../cities/cities.service';

@Module({
  controllers: [RatingsController],
  providers: [
    RatingsService,
    PrismaService,
    UsersService,
    AuthService,
    CitiesService,
  ],
})
export class RatingsModule {}

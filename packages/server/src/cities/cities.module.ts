import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaService } from '../shared/prisma.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, PrismaService, UsersService, AuthService],
})
export class CitiesModule {}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../shared/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, UsersService, AuthService],
})
export class CategoriesModule {}

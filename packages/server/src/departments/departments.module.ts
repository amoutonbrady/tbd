import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { PrismaService } from '../shared/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, PrismaService, UsersService, AuthService],
})
export class DepartmentsModule {}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    if (!request.headers.authorization) return false;

    const [_, token] = request.headers.authorization.split(' ');
    const payload = await this.auth.validate(token);
    const user = await this.users.findOne({ id: payload.userId });

    request.user = user;

    return true;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: Omit<User, 'password'>;
  }
}

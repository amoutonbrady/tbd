import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class AuthService {
  private hash = 'myhash';

  constructor(private readonly prisma: PrismaService) {}

  async validate(jwt: string) {
    try {
      return verify(jwt, this.hash) as { userId: number };
    } catch {
      throw new ForbiddenException();
    }
  }

  async signIn(email: string, clearPassword: string) {
    const { password, ...user } = await this.prisma.user.findUnique({
      rejectOnNotFound: true,
      where: { email },
    });

    const match = await compare(clearPassword, password);
    if (!match) throw new ForbiddenException();

    return { ...user, token: sign({ userId: user.id }, this.hash) };
  }

  async signUp(email: string, clearPassword: string) {
    const password = await hash(clearPassword, 10);

    const user = await this.prisma.user.create({
      data: { email, password },
      select: { createdAt: true, email: true, id: true, updateAt: true },
    });

    return { ...user, token: sign({ userId: user.id }, this.hash) };
  }
}

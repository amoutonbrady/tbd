import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({ skip, take, cursor, where, orderBy });
  }

  findOne(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findFirst({
      where,
      select: { createdAt: true, email: true, id: true, updateAt: true },
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.user.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput) {
    await this.prisma.ratingCategoriesOnRatings.deleteMany({
      where: { rating: { userId: where.id } },
    });

    await this.prisma.rating.deleteMany({
      where: { userId: where.id },
    });

    return this.prisma.user.delete({
      where,
    });
  }
}

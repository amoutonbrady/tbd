import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class RatingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.RatingCreateInput) {
    return this.prisma.rating.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RatingWhereUniqueInput;
    where?: Prisma.RatingWhereInput;
    orderBy?: Prisma.RatingOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const total = await this.prisma.rating.count();
    const cities = await this.prisma.rating.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        categories: true,
      },
    });

    return [cities, total] as const;
  }

  findOne(where: Prisma.RatingWhereUniqueInput) {
    return this.prisma.rating.findFirst({ where });
  }

  update(params: {
    where: Prisma.RatingWhereUniqueInput;
    data: Prisma.RatingUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.rating.update({
      where,
      data,
    });
  }

  remove(where: Prisma.RatingWhereUniqueInput) {
    return this.prisma.rating.delete({
      where,
    });
  }
}

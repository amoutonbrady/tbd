import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.RatingCategoryCreateInput) {
    return this.prisma.ratingCategory.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RatingCategoryWhereUniqueInput;
    where?: Prisma.RatingCategoryWhereInput;
    orderBy?: Prisma.RatingCategoryOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const total = await this.prisma.ratingCategory.count();
    const cities = await this.prisma.ratingCategory.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return [cities, total] as const;
  }

  findOne(where: Prisma.RatingCategoryWhereUniqueInput) {
    return this.prisma.ratingCategory.findFirst({ where });
  }

  update(params: {
    where: Prisma.RatingCategoryWhereUniqueInput;
    data: Prisma.RatingCategoryUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.ratingCategory.update({
      where,
      data,
    });
  }

  remove(where: Prisma.RatingCategoryWhereUniqueInput) {
    return this.prisma.ratingCategory.delete({
      where,
    });
  }
}

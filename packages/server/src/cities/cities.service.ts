import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.CityCreateInput) {
    return this.prisma.city.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CityWhereUniqueInput;
    where?: Prisma.CityWhereInput;
    orderBy?: Prisma.CityOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;

    const total = await this.prisma.city.count();
    const cities = await this.prisma.city.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    return [cities, total] as const;
  }

  findOne(where: Prisma.CityWhereUniqueInput) {
    return this.prisma.city.findFirst({ where });
  }

  update(params: {
    where: Prisma.CityWhereUniqueInput;
    data: Prisma.CityUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.city.update({
      where,
      data,
    });
  }

  remove(where: Prisma.CityWhereUniqueInput) {
    return this.prisma.city.delete({
      where,
    });
  }
}

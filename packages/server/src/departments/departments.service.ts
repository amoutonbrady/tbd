import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../shared/prisma.service';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.DepartmentCreateInput) {
    return this.prisma.department.create({ data });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DepartmentWhereUniqueInput;
    where?: Prisma.DepartmentWhereInput;
    orderBy?: Prisma.DepartmentOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.department.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(where: Prisma.DepartmentWhereUniqueInput) {
    return this.prisma.department.findFirst({ where });
  }

  update(params: {
    where: Prisma.DepartmentWhereUniqueInput;
    data: Prisma.DepartmentUpdateInput;
  }) {
    const { where, data } = params;
    return this.prisma.department.update({
      where,
      data,
    });
  }

  remove(where: Prisma.DepartmentWhereUniqueInput) {
    return this.prisma.department.delete({
      where,
    });
  }
}

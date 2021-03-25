import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import slugify from '@sindresorhus/slugify';
import { CitiesService } from './cities.service';
import { AuthGuard } from '../shared/auth.guard';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body()
    data: {
      name: string;
      longitude: number;
      latitude: number;
      department: string;
      zip: string;
      insee: string;
    },
  ) {
    const { department, ...city } = data;
    const slug = slugify(city.name);

    return this.citiesService.create({
      ...city,
      slug,
      department: { connect: { code: department } },
    });
  }

  @Get()
  async findAll(
    @Query('skip') skip = '0',
    @Query('take') take = '20',
    @Res({ passthrough: true }) response: FastifyReply,
    @Query('s') search = '',
  ) {
    const [cities, count] = await this.citiesService.findAll({
      skip: parseInt(skip, 10),
      take: parseInt(take, 10),
      where: {
        OR: [
          {
            name: { contains: search },
          },
          {
            zip: { contains: search },
          },
          {
            slug: { contains: search },
          },
        ],
      },
    });

    response.header('x-count', `${count}`);
    response.header('x-pages', `${Math.floor(count / parseInt(take, 10))}`);

    return cities;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    data: {
      name: string;
      longitude: number;
      latitude: number;
      department: string;
      zip: string;
      insee: string;
    },
  ) {
    const { department, ...city } = data;
    const slug = city.name ? slugify(data.name) : undefined;

    return this.citiesService.update({
      data: {
        ...city,
        slug,
        department: department ? { connect: { code: department } } : undefined,
      },
      where: { id },
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.citiesService.remove({ id });
  }
}

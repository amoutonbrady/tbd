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
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../shared/auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body()
    category: {
      name: string;
    },
  ) {
    const slug = slugify(category.name);

    return this.categoriesService.create({
      ...category,
      slug,
    });
  }

  @Get()
  async findAll(
    @Query('skip') skip = '0',
    @Query('take') take = '20',
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const [cities, count] = await this.categoriesService.findAll({
      skip: parseInt(skip, 10),
      take: parseInt(take, 10),
    });

    response.header('x-count', `${count}`);
    response.header('x-pages', `${Math.floor(count / parseInt(take, 10))}`);

    return cities;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    category: {
      name: string;
    },
  ) {
    const slug = category.name ? slugify(category.name) : undefined;

    return this.categoriesService.update({
      data: {
        ...category,
        slug,
      },
      where: { id },
    });
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove({ id });
  }
}

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
import { User as IUser } from '@prisma/client';
import { FastifyReply } from 'fastify';
import { AuthGuard } from '../shared/auth.guard';
import { User } from '../shared/user.decorator';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @User() user: IUser,
    @Body()
    data: {
      city: number;
      pros: string;
      cons: string;
      categories: { category: number; note: number }[];
    },
  ) {
    const { city, categories = [], ...rating } = data;

    return this.ratingsService.create({
      ...rating,
      city: { connect: { id: city } },
      downvotes: 0,
      upvotes: 0,
      user: { connect: { id: user.id } },
      categories: {
        create: categories.map(({ category, note }) => ({
          note,
          ratingCategory: { connect: { id: category } },
        })),
      },
    });
  }

  @Get()
  async findAll(
    @Query('skip') skip = '0',
    @Query('take') take = '20',
    @Query('city') city: string,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const [ratings, count] = await this.ratingsService.findAll({
      skip: parseInt(skip, 10),
      take: parseInt(take, 10),
      where: { cityId: city ? parseInt(city, 10) : undefined },
    });

    response.header('x-count', `${count}`);
    response.header('x-pages', `${Math.floor(count / parseInt(take, 10))}`);

    return ratings;
  }

  @Get('load')
  @UseGuards(AuthGuard)
  loadExternalRatings(@Query('city') city: string, @User() user: IUser) {
    const id = parseInt(city, 10);

    return this.ratingsService.loadExternalRatings(id, user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(2);
    return this.ratingsService.findOne({ id });
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body()
  //   category: {
  //     name: string;
  //   },
  // ) {
  //   const slug = category.name ? slugify(category.name) : undefined;

  //   return this.ratingsService.update({
  //     data: {
  //       ...category,
  //       slug,
  //     },
  //     where: { id },
  //   });
  // }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ratingsService.remove({ id });
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import slugify from '@sindresorhus/slugify';
import { AuthGuard } from '../shared/auth.guard';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() department: { name: string; code: string }) {
    const slug = slugify(department.name);
    return this.departmentsService.create({ ...department, slug });
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { name: string; code: string },
  ) {
    const slug = data.name ? slugify(data.name) : undefined;

    return this.departmentsService.update({
      where: { id },
      data: { ...data, slug },
    });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.remove({ id });
  }
}

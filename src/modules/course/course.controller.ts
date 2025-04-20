import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
} from '@nestjs/common';

import { Auth } from '@modules/auth/decorators';

import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll() {
        return this.courseService.getAll();
    }

    @Get('popular')
    @HttpCode(HttpStatus.OK)
    async getPopular() {
        return this.courseService.getPopular();
    }

    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    async getBySlug(@Param('slug') slug: string) {
        return this.courseService.getBySlug(slug);
    }

    @Get(':id/lessons')
    @HttpCode(HttpStatus.OK)
    async getCourseLessons(@Param('id') id: string) {
        return this.courseService.getCourseLessons(id);
    }

    @Patch(':id/views')
    @HttpCode(HttpStatus.NO_CONTENT)
    async incrementViews(@Param('id') id: string) {
        await this.courseService.incrementViews(id);
    }

    @Auth('ADMIN')
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
        return this.courseService.update(id, dto);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Body() dto: CreateCourseDto) {
        return this.courseService.create(dto);
    }
}

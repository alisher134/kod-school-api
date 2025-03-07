import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';

import { Course } from '@prisma/generated';

import { Auth } from '@modules/auth/decorators';

import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) {}

    @Auth()
    @Get('by-slug/:courseSlug')
    @HttpCode(HttpStatus.OK)
    getBySlug(@Param('courseSlug') courseSlug: string): Promise<Course> {
        return this.courseService.getBySlug(courseSlug);
    }

    //Admin place

    @Auth('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    getAll(): Promise<Course[]> {
        return this.courseService.getAll();
    }

    @Auth('ADMIN')
    @Get('by-id/:courseId')
    @HttpCode(HttpStatus.OK)
    getById(@Param('courseId') courseId: string): Promise<Course> {
        return this.courseService.getById(courseId);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(): Promise<{ id: string }> {
        return this.courseService.create();
    }

    @Auth('ADMIN')
    @Put(':courseId')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('courseId') courseId: string,
        @Body() courseDto: UpdateCourseDto,
    ): Promise<Course> {
        return this.courseService.update(courseId, courseDto);
    }

    @Auth('ADMIN')
    @Delete(':courseId')
    @HttpCode(HttpStatus.OK)
    delete(@Param('courseId') courseId: string): Promise<Course> {
        return this.courseService.delete(courseId);
    }
}

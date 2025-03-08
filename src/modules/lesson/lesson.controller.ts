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

import type { Lesson } from '@prisma/generated';

import { Auth } from '@modules/auth/decorators';

import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Auth('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    getAll(): Promise<Lesson[]> {
        return this.lessonService.getAll();
    }

    @Auth()
    @Get('by-slug/:lessonSlug')
    @HttpCode(HttpStatus.OK)
    getBySlug(@Param('lessonSlug') lessonSlug: string): Promise<Lesson> {
        return this.lessonService.getBySlug(lessonSlug);
    }

    //Admin place

    @Auth('ADMIN')
    @Get('by-id/:lessonId')
    @HttpCode(HttpStatus.OK)
    getById(@Param('lessonId') lessonId: string): Promise<Lesson> {
        return this.lessonService.getById(lessonId);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createLessonDto: CreateLessonDto): Promise<{ id: string }> {
        return this.lessonService.create(createLessonDto);
    }

    @Auth('ADMIN')
    @Put(':lessonId')
    @HttpCode(HttpStatus.OK)
    update(
        @Param('lessonId') lessonId: string,
        @Body() lessonDto: UpdateLessonDto,
    ): Promise<Lesson> {
        return this.lessonService.update(lessonId, lessonDto);
    }

    @Auth('ADMIN')
    @Delete(':lessonId')
    @HttpCode(HttpStatus.OK)
    delete(@Param('lessonId') lessonId: string): Promise<Lesson> {
        return this.lessonService.delete(lessonId);
    }
}

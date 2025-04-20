import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
} from '@nestjs/common';

import { User } from '@prisma/generated';

import { Auth, CurrentUser } from '@modules/auth/decorators';

import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Get(':slug')
    @HttpCode(HttpStatus.OK)
    async getBySlug(@Param('slug') slug: string) {
        return this.lessonService.getBySlug(slug);
    }

    @Auth()
    @Get(':id/progress')
    @HttpCode(HttpStatus.OK)
    async getCompletedLessons(
        @CurrentUser() user: User,
        @Param('id') id: string,
    ) {
        return this.lessonService.getCompletedLessons(user, id);
    }

    @Auth('ADMIN')
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
        return this.lessonService.update(id, dto);
    }

    @Auth('ADMIN')
    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Body() dto: CreateLessonDto) {
        return this.lessonService.create(dto);
    }
}

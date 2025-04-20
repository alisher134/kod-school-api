import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
} from '@nestjs/common';

import { User } from '@prisma/generated';

import { Auth, CurrentUser } from '@modules/auth/decorators';

import { CreateProgressDto } from './dto/create-progress.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Auth()
    @Put()
    @HttpCode(HttpStatus.OK)
    public async create(
        @CurrentUser() user: User,
        @Body() dto: CreateProgressDto,
    ) {
        return this.progressService.create(user, dto);
    }

    @Auth()
    @Get(':courseId')
    @HttpCode(HttpStatus.OK)
    async getCourseProgress(
        @CurrentUser() user: User,
        @Param('courseId') courseId: string,
    ) {
        return this.progressService.getCourseProgress(user, courseId);
    }
}

import { Module } from '@nestjs/common';

import { PaginationService } from '@modules/pagination/pagination.service';

import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
    controllers: [CourseController],
    providers: [CourseService, PaginationService],
})
export class CourseModule {}

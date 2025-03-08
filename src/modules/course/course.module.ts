import { Module } from '@nestjs/common';

import { SectionModule } from '@modules/section';

import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

@Module({
    imports: [SectionModule],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository],
})
export class CourseModule {}

import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { CourseModule } from './course';
import { LessonModule } from './lesson';
import { MediaModule } from './media';
import { ProgressModule } from './progress/progress.module';
import { TokenModule } from './token';
import { UserModule } from './user';

@Module({
    imports: [
        UserModule,
        AuthModule,
        TokenModule,
        MediaModule,
        CourseModule,
        LessonModule,
        ProgressModule,
    ],
})
export class ModulesModule {}

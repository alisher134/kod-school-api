import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { CommentModule } from './comment';
import { CourseModule } from './course';
import { LessonModule } from './lesson';
import { MediaModule } from './media';
import { ProgressModule } from './progress';
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
        CommentModule,
    ],
})
export class ModulesModule {}

import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { CourseModule } from './course';
import { DirectionModule } from './direction';
import { MediaModule } from './media';
import { SectionModule } from './section';
import { TokenModule } from './token';
import { UserModule } from './user';

@Module({
    imports: [
        UserModule,
        AuthModule,
        TokenModule,
        MediaModule,
        DirectionModule,
        CourseModule,
        SectionModule,
    ],
})
export class ModulesModule {}

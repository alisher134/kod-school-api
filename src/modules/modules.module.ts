import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { DirectionModule } from './direction';
import { MediaModule } from './media';
import { TokenModule } from './token';
import { UserModule } from './user';

@Module({
    imports: [
        UserModule,
        AuthModule,
        TokenModule,
        MediaModule,
        DirectionModule,
    ],
})
export class ModulesModule {}

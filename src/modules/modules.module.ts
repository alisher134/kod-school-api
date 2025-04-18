import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { MediaModule } from './media';
import { TokenModule } from './token';
import { UserModule } from './user';

@Module({
    imports: [UserModule, AuthModule, TokenModule, MediaModule],
})
export class ModulesModule {}

import { Module } from '@nestjs/common';

import { AuthModule } from './auth';
import { TokenModule } from './token';
import { UserModule } from './user';

@Module({
    imports: [UserModule, AuthModule, TokenModule],
})
export class ModulesModule {}

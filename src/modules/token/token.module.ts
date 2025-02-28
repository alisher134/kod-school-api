import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenConfig } from './token.config';
import { TokenService } from './token.service';
import { TokenStorage } from './token.storage';

@Module({
    imports: [JwtModule],
    providers: [TokenService, TokenConfig, TokenStorage],
    exports: [TokenService, TokenStorage],
})
export class TokenModule {}

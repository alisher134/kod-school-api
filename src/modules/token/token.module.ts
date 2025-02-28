import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokenConfig } from './token.config';
import { TokenService } from './token.service';

@Module({
    imports: [JwtModule],
    providers: [TokenService, TokenConfig],
    exports: [TokenService],
})
export class TokenModule {}

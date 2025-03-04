import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { HashModule } from '@modules/hash';
import { FingerprintService } from '@modules/token/fingerprint.service';

import { TokenConfig } from './token.config';
import { TokenService } from './token.service';
import { TokenStorage } from './token.storage';

@Module({
    imports: [JwtModule, HashModule],
    providers: [TokenService, TokenConfig, TokenStorage, FingerprintService],
    exports: [TokenService, TokenStorage],
})
export class TokenModule {}

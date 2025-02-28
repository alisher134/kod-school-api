import { Module } from '@nestjs/common';

import { HashService } from '@modules/hash';
import { TokenModule } from '@modules/token';
import { UserModule } from '@modules/user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [UserModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService, HashService, JwtStrategy],
})
export class AuthModule {}

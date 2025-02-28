import { Module } from '@nestjs/common';

import { HashService } from '@modules/hash';
import { TokenModule } from '@modules/token';
import { UserModule } from '@modules/user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptsService } from './login-attempts.service';
import { JwtStrategy } from './strategies';

@Module({
    imports: [UserModule, TokenModule],
    controllers: [AuthController],
    providers: [AuthService, HashService, JwtStrategy, LoginAttemptsService],
})
export class AuthModule {}

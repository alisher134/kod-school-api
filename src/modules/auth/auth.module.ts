import { Module } from '@nestjs/common';

import { MailModule } from '@infrastructure/mail';

import { HashService } from '@modules/hash';
import { TokenModule } from '@modules/token';
import { UserModule } from '@modules/user';

import { AuthController } from './auth.controller';
import {
    AuthService,
    LoginAttemptsService,
    RestorePasswordService,
    TokenCookieService,
} from './services';
import { JwtStrategy } from './strategies';

@Module({
    imports: [UserModule, TokenModule, MailModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        HashService,
        JwtStrategy,
        LoginAttemptsService,
        RestorePasswordService,
        TokenCookieService,
    ],
})
export class AuthModule {}

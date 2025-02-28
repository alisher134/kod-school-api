import { Module } from '@nestjs/common';

import { MailModule } from '@infrastructure/mail';

import { HashService } from '@modules/hash';
import { TokenModule } from '@modules/token';
import { UserModule } from '@modules/user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAttemptsService } from './login-attempts.service';
import { RestorePasswordService } from './restore-password.service';
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
    ],
})
export class AuthModule {}

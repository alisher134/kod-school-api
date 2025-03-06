import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Patch,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';

import { User } from '@prisma/generated';

import { translate } from '@infrastructure/i18n';

import { TAccessToken } from './auth.interface';
import { CurrentUser } from './decorators';
import {
    ForgotPasswordDto,
    LoginDto,
    RegisterDto,
    RestorePasswordDto,
} from './dto';
import {
    AuthService,
    RestorePasswordService,
    TokenCookieService,
} from './services';

@Controller('auth')
export class AuthController {
    private readonly REFRESH_TOKEN_NAME = 'refreshToken';

    constructor(
        private readonly authService: AuthService,
        private readonly restorePasswordService: RestorePasswordService,
        private readonly tokenCookieService: TokenCookieService,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() dto: RegisterDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } = await this.authService.register(
            dto,
            req,
        );
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } = await this.authService.login(
            dto,
            req,
        );
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const refreshTokenFromCookie = req.cookies[this.REFRESH_TOKEN_NAME];
        if (!refreshTokenFromCookie)
            throw new UnauthorizedException(
                translate('exception.refreshTokenMissing'),
            );

        const { accessToken, refreshToken } = await this.authService.refresh(
            refreshTokenFromCookie,
            req,
        );
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
        return this.restorePasswordService.forgotPassword(dto);
    }

    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Patch('restore-password')
    @HttpCode(HttpStatus.OK)
    restorePassword(@Body() dto: RestorePasswordDto): Promise<User> {
        return this.restorePasswordService.restorePassword(dto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(
        @Res({ passthrough: true }) res: Response,
        @CurrentUser('id') id: string,
    ): Promise<void> {
        await this.authService.logout(id);
        this.tokenCookieService.removeRefreshTokenFromCookie(res);
    }
}

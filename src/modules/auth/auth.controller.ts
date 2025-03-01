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
import { User } from '@prisma/client';
import type { Request, Response } from 'express';

import { translate } from '@infrastructure/i18n';

import { TAccessToken } from './auth.interface';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { ForgotPasswordDto, RestorePasswordDto } from './dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RestorePasswordService } from './restore-password.service';
import { TokenCookieService } from './token-cookie.service';

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
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } =
            await this.authService.register(dto);
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } = await this.authService.login(dto);
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

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
        );
        this.tokenCookieService.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
        return this.restorePasswordService.forgotPassword(dto);
    }

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

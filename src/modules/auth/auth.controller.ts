import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { isProd } from '@common/utils';

import { IConfigs } from '@infrastructure/config';

import { TAccessToken } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    private readonly REFRESH_TOKEN_NAME = 'refreshToken';

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService<IConfigs>,
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(
        @Body() dto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } =
            await this.authService.register(dto);
        this.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<TAccessToken> {
        const { accessToken, refreshToken } = await this.authService.login(dto);
        this.setRefreshTokenToCookie(res, refreshToken);
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
            throw new UnauthorizedException('Refresh token not be passed');

        const { accessToken, refreshToken } = await this.authService.refresh(
            refreshTokenFromCookie,
        );
        this.setRefreshTokenToCookie(res, refreshToken);
        return { accessToken };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response): Promise<void> {
        this.removeRefreshTokenFromCookie(res);
    }

    private setRefreshTokenToCookie(res: Response, refreshToken: string): void {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + 7);

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            secure: isProd,
            domain: this.configService.get<string>('app.domain', {
                infer: true,
            }),
            sameSite: 'lax',
            expires: expiresIn,
        });
    }

    private removeRefreshTokenFromCookie(res: Response): void {
        res.clearCookie(this.REFRESH_TOKEN_NAME, {
            httpOnly: true,
            secure: isProd,
            domain: this.configService.get<string>('app.domain', {
                infer: true,
            }),
            sameSite: 'lax',
        });
    }
}

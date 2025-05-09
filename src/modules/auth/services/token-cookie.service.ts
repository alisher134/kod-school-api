import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { isProd } from '@common/utils';

import { IConfigs } from '@infrastructure/config';

@Injectable()
export class TokenCookieService {
    private readonly REFRESH_TOKEN_NAME = 'refreshToken';

    constructor(
        private readonly configService: ConfigService<IConfigs, true>,
    ) {}

    setRefreshTokenToCookie(res: Response, refreshToken: string): void {
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            secure: isProd,
            domain: this.configService.get('app.domain', {
                infer: true,
            }),
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    removeRefreshTokenFromCookie(res: Response): void {
        res.clearCookie(this.REFRESH_TOKEN_NAME, {
            httpOnly: true,
            secure: isProd,
            domain: this.configService.get('app.domain', {
                infer: true,
            }),
            sameSite: 'strict',
        });
    }
}

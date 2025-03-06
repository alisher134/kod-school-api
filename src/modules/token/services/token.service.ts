import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { type Request } from 'express';

import { translate } from '@infrastructure/i18n';
import { RedisService } from '@infrastructure/redis';

import { TokenConfig } from '../token.config';
import type { ITokenPair, ITokenPayload } from '../token.interface';
import { TokenStorage } from '../token.storage';

import { FingerprintService } from './fingerprint.service';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenConfig: TokenConfig,
        private readonly tokenStorage: TokenStorage,
        private readonly redisService: RedisService,
        private readonly fingerprintService: FingerprintService,
    ) {}

    async issueTokenPair(
        payload: ITokenPayload,
        req: Request,
    ): Promise<ITokenPair> {
        const fingerprint =
            await this.fingerprintService.generateFingerprint(req);
        const [accessToken, refreshToken] = await Promise.all([
            this.createAccessToken(payload),
            this.createRefreshToken(payload),
        ]);

        await this.tokenStorage.storeRefreshToken(
            refreshToken,
            payload.id,
            fingerprint,
        );

        return { accessToken, refreshToken };
    }

    async generateToken(
        payload: ITokenPayload,
        options?: JwtSignOptions,
    ): Promise<string> {
        return this.jwtService.signAsync(payload, options);
    }

    async validateToken(
        token: string,
        options?: JwtVerifyOptions,
    ): Promise<ITokenPayload> {
        try {
            return await this.jwtService.verifyAsync(token, options);
        } catch {
            throw new UnauthorizedException(
                translate('exception.refreshTokenInvalid'),
            );
        }
    }

    private async createAccessToken(payload: ITokenPayload): Promise<string> {
        return this.generateToken(
            payload,
            this.tokenConfig.getAccessTokenOptions(),
        );
    }

    private async createRefreshToken(payload: ITokenPayload): Promise<string> {
        return this.generateToken(
            payload,
            this.tokenConfig.getRefreshTokenOptions(),
        );
    }
}

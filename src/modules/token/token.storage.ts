import { Injectable } from '@nestjs/common';
import type { Request } from 'express';

import { RedisService } from '@infrastructure/redis';

import { FingerprintService } from './fingerprint.service';
import { TokenConfig } from './token.config';

@Injectable()
export class TokenStorage {
    constructor(
        private readonly redisService: RedisService,
        private readonly tokenConfig: TokenConfig,
        private readonly fingerprintService: FingerprintService,
    ) {}

    async storeRefreshToken(
        refreshToken: string,
        userId: string,
        fingerprint: string,
    ): Promise<void> {
        const key = this.generateKey(userId);
        const value = JSON.stringify({ refreshToken, fingerprint });

        await this.redisService.setex(
            key,
            this.tokenConfig.getRefreshTokenTtl(),
            value,
        );
    }

    async invalidateRefreshToken(userId: string): Promise<void> {
        const key = this.generateKey(userId);

        await this.redisService.del(key);
    }

    async validateRefreshToken(
        refreshToken: string,
        userId: string,
        req: Request,
    ): Promise<boolean> {
        const key = this.generateKey(userId);
        const cacheData = await this.redisService.get(key);
        if (!cacheData) return false;

        const {
            refreshToken: cacheRefreshToken,
            fingerprint: cacheFingerprint,
        } = JSON.parse(cacheData);

        const newFingerprint =
            await this.fingerprintService.generateFingerprint(req);
        const isValidFingerprint =
            await this.fingerprintService.compareFingerprints(
                cacheFingerprint,
                newFingerprint,
            );

        return cacheRefreshToken === refreshToken && isValidFingerprint;
    }

    private generateKey(userId: string): string {
        return `${this.tokenConfig.getRefreshTokenKey()}:${userId}`;
    }
}

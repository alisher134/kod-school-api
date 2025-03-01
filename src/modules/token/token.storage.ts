import { Injectable } from '@nestjs/common';

import { RedisService } from '@infrastructure/redis';

import { TokenConfig } from './token.config';

@Injectable()
export class TokenStorage {
    constructor(
        private readonly redisService: RedisService,
        private readonly tokenConfig: TokenConfig,
    ) {}

    async storeRefreshToken(
        refreshToken: string,
        userId: string,
    ): Promise<void> {
        const key = this.generateKey(userId);

        await this.redisService.setex(
            key,
            this.tokenConfig.getRefreshTokenTtl(),
            refreshToken,
        );
    }

    async invalidateRefreshToken(userId: string): Promise<void> {
        const key = this.generateKey(userId);

        await this.redisService.del(key);
    }

    async validateRefreshToken(userId: string, refreshToken: string) {
        const key = this.generateKey(userId);
        const cacheData = await this.redisService.get(key);

        if (!cacheData) return false;

        return cacheData === refreshToken;
    }

    private generateKey(userId: string) {
        return `${this.tokenConfig.getRefreshTokenKey()}:${userId}`;
    }
}

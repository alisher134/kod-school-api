import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

import { IConfigs } from '@infrastructure/config';

@Injectable()
export class TokenConfig {
    constructor(
        private readonly configService: ConfigService<IConfigs, true>,
    ) {}

    getAccessTokenOptions(): JwtSignOptions {
        return {
            expiresIn: this.configService.get('jwt.accessExpire', {
                infer: true,
            }),
            secret: this.configService.get('jwt.accessSecret', {
                infer: true,
            }),
        };
    }

    getRefreshTokenOptions(): JwtSignOptions {
        return {
            expiresIn: this.configService.get('jwt.refreshExpire', {
                infer: true,
            }),
            secret: this.configService.get('jwt.refreshSecret', {
                infer: true,
            }),
        };
    }

    getRefreshTokenTtl(): number {
        return 604800;
    }

    getRefreshTokenKey(): string {
        return 'refresh_token';
    }
}

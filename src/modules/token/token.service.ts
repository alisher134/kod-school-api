import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

import { TokenConfig } from './token.config';
import { ITokenPair, ITokenPayload } from './token.interface';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenConfig: TokenConfig,
    ) {}

    async issueTokenPair(payload: ITokenPayload): Promise<ITokenPair> {
        const [accessToken, refreshToken] = await Promise.all([
            this.createAccessToken(payload),
            this.createRefreshToken(payload),
        ]);

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
            throw new UnauthorizedException('Invalid or expired token');
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

import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';
import type { Request } from 'express';

import type { IConfigs } from '@infrastructure/config';
import { translate } from '@infrastructure/i18n';

import { HashService } from '@modules/hash';
import {
    type ITokenPair,
    type ITokenPayload,
    TokenService,
    TokenStorage,
} from '@modules/token';
import { UserService } from '@modules/user';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginAttemptsService } from './login-attempts.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
        private readonly tokenStorage: TokenStorage,
        private readonly loginAttemptsService: LoginAttemptsService,
        private readonly configService: ConfigService<IConfigs, true>,
    ) {}

    async register(
        registerDto: RegisterDto,
        req: Request,
    ): Promise<ITokenPair> {
        const existingUser = await this.userService.findByEmail(
            registerDto.email,
        );
        if (existingUser)
            throw new ConflictException(translate('exception.isExist'));

        const user = await this.userService.create(registerDto);
        return this.generateTokens(user.id, req);
    }

    async login(loginDto: LoginDto, req: Request): Promise<ITokenPair> {
        await this.loginAttemptsService.checkAttempts(loginDto.email);

        const user = await this.validate(loginDto);
        return this.generateTokens(user.id, req);
    }

    async refresh(refreshToken: string, req: Request): Promise<ITokenPair> {
        const payload = await this.tokenService.validateToken(refreshToken, {
            secret: this.configService.get('jwt.refreshSecret', {
                infer: true,
            }),
        });

        await this.tokenStorage.validateRefreshToken(
            refreshToken,
            payload.id,
            req,
        );

        const user = await this.userService.findById(payload.id);

        await this.tokenStorage.invalidateRefreshToken(user.id);

        return this.generateTokens(user.id, req);
    }

    async logout(userId: string) {
        return await this.tokenStorage.invalidateRefreshToken(userId);
    }

    private async validate(loginDto: LoginDto): Promise<User> {
        const user = await this.userService.findByEmail(loginDto.email);

        const isPasswordMatch = user
            ? await this.hashService.comparePassword(
                  user.password,
                  loginDto.password,
              )
            : false;

        if (!user || !isPasswordMatch) {
            await this.loginAttemptsService.incrementAttempts(loginDto.email);
            throw new BadRequestException(translate('exception.invalid'));
        }

        await this.loginAttemptsService.resetAttempts(loginDto.email);

        return user;
    }

    private async generateTokens(
        userId: string,
        req: Request,
    ): Promise<ITokenPair> {
        const payload: ITokenPayload = { id: userId };
        return this.tokenService.issueTokenPair(payload, req);
    }
}

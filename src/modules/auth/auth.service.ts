import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';

import type { IConfigs } from '@infrastructure/config';

import { HashService } from '@modules/hash';
import { type ITokenPair, ITokenPayload, TokenService } from '@modules/token';
import { UserService } from '@modules/user';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService,
        private readonly configService: ConfigService<IConfigs, true>,
    ) {}

    async register(registerDto: RegisterDto): Promise<ITokenPair> {
        const existingUser = await this.userService.findByEmail(
            registerDto.email,
        );
        if (existingUser)
            throw new ConflictException('Email is already exists!');

        const user = await this.userService.create(registerDto);
        return await this.generateTokens(user.id);
    }

    async login(loginDto: LoginDto): Promise<ITokenPair> {
        const user = await this.validate(loginDto);
        return await this.generateTokens(user.id);
    }

    async refresh(refreshToken: string): Promise<ITokenPair> {
        const payload = await this.tokenService.validateToken(refreshToken, {
            secret: this.configService.get('jwt.refreshSecret', {
                infer: true,
            }),
        });

        const user = await this.userService.findById(payload.id, { id: true });

        return await this.generateTokens(user.id);
    }

    private async validate(loginDto: LoginDto): Promise<User> {
        const user = await this.userService.findByEmail(loginDto.email, {
            id: true,
            password: true,
        });
        const isPasswordMatch = user
            ? await this.hashService.comparePassword(
                  user.password,
                  loginDto.password,
              )
            : false;

        if (!user || !isPasswordMatch) {
            throw new BadRequestException('Email or password is incorrect');
        }

        return user;
    }

    private async generateTokens(userId: string): Promise<ITokenPair> {
        const payload: ITokenPayload = { id: userId };
        return this.tokenService.issueTokenPair(payload);
    }
}

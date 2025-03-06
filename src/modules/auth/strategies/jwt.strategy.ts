import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { User } from '@prisma/generated';

import { isDev } from '@common/utils';

import { IConfigs } from '@infrastructure/config';

import { UserService } from '@modules/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService<IConfigs>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: isDev,
            secretOrKey: configService.get('jwt.accessSecret', {
                infer: true,
            }),
        });
    }

    async validate({ id }: Pick<User, 'id'>): Promise<User | null> {
        return this.userService.findById(id);
    }
}

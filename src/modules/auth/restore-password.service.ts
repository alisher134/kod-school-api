import RestorePassword from '@emails/restore-password';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { User } from '@prisma/client';

import { IConfigs } from '@infrastructure/config';
import { translate } from '@infrastructure/i18n';
import { MailService } from '@infrastructure/mail';

import { HashService } from '@modules/hash';
import { type ITokenPayload, TokenService } from '@modules/token';
import { UserRepository, UserService } from '@modules/user';

import { ForgotPasswordDto, RestorePasswordDto } from './dto';

@Injectable()
export class RestorePasswordService {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
        private readonly mailService: MailService,
        private readonly configService: ConfigService<IConfigs, true>,
    ) {}

    async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
        const user = await this.userService.findByEmail(dto.email);
        if (!user) throw new NotFoundException(translate('exception.notFound'));

        const payload: ITokenPayload = {
            id: user.id,
        };

        const token = await this.tokenService.generateToken(payload, {
            secret: this.configService.get('jwt.restoreSecret', {
                infer: true,
            }),
            expiresIn: this.configService.get('jwt.restoreExpire', {
                infer: true,
            }),
        });

        const clientUrl = this.configService.get('app.allowedOrigin', {
            infer: true,
        });
        const resetLink = `${clientUrl}/auth/reset?token=${token}`;

        await this.mailService.sendTemplateEmail(
            user.email,
            'Восстановление пароля',
            RestorePassword,
            {
                email: user.email,
                resetLink,
            },
        );
    }
    async restorePassword(dto: RestorePasswordDto): Promise<User> {
        const verify = await this.tokenService.validateToken(dto.token, {
            secret: this.configService.get('jwt.restoreSecret', {
                infer: true,
            }),
        });
        if (!verify)
            throw new BadRequestException(
                translate('exception.invalidRestoreToken'),
            );

        const hashedPassword = await this.hashService.hashPassword(
            dto.newPassword,
        );

        const updateUser = await this.userRepository.update(
            {
                id: verify.id,
            },
            {
                password: hashedPassword,
            },
        );

        return updateUser;
    }
}

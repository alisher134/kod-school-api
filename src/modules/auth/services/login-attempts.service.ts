import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { translate } from '@infrastructure/i18n';
import { RedisService } from '@infrastructure/redis';

@Injectable()
export class LoginAttemptsService {
    private readonly LOGIN_ATTEMPTS_KEY = 'login_attempts';
    private readonly MAX_ATTEMPTS = 3;
    private readonly BLOCK_TIME = 300;

    private logger = new Logger(LoginAttemptsService.name);

    constructor(private readonly redisService: RedisService) {}

    async incrementAttempts(email: string) {
        const key = this.getAttemptsKey(email);
        const newAttempts = await this.redisService.incr(key);

        if (newAttempts === 1)
            await this.redisService.expire(key, this.BLOCK_TIME);
    }

    async checkAttempts(email: string) {
        const key = this.getAttemptsKey(email);
        const attemptsCount = await this.redisService.get(key);
        const ttl = await this.redisService.ttl(key);
        const count = attemptsCount ? parseInt(attemptsCount, 10) : 0;

        if (count >= this.MAX_ATTEMPTS) {
            this.logger.warn(
                'Пользователь временно заблокирован из-за слишком большого количества попыток входа в систему',
            );
            throw new BadRequestException(
                translate('exception.tooManyAttempts', { args: { ttl } }),
            );
        }
    }

    async resetAttempts(email: string) {
        const key = this.getAttemptsKey(email);
        await this.redisService.del(key);
    }

    private getAttemptsKey(email: string) {
        return `${this.LOGIN_ATTEMPTS_KEY}:${email}`;
    }
}

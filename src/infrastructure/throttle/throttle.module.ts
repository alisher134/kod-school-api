import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { I18nThrottlerGuard } from '@common/guards';

import { IConfigs } from '@infrastructure/config';
import { translate } from '@infrastructure/i18n';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (
                configService: ConfigService<IConfigs, true>,
            ) => ({
                throttlers: [
                    {
                        limit: configService.get('app.throttleLimit', {
                            infer: true,
                        }),
                        ttl: configService.get('app.throttleTtl', {
                            infer: true,
                        }),
                    },
                ],
                errorMessage: translate('exception.tooManyRequests'),
                storage: new ThrottlerStorageRedisService({
                    host: configService.get('redis.host', { infer: true }),
                    port: configService.get('redis.port', { infer: true }),
                    password: configService.get('redis.password', {
                        infer: true,
                    }),
                }),
            }),
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: I18nThrottlerGuard,
        },
    ],
})
export class NestThrottleModule {}

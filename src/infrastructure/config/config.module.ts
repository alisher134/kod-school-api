import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { isDev } from '@common/utils';

import {
    appConfig,
    appConfigValidationSchema,
    databaseConfig,
    databaseConfigValidationSchema,
    jwtConfig,
    jwtConfigValidationSchema,
    mailConfig,
    mailConfigValidationSchema,
    redisConfig,
    redisConfigValidationSchema,
} from './configs';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: isDev ? '.env.development' : '.env.production',
            load: [
                appConfig,
                databaseConfig,
                redisConfig,
                jwtConfig,
                mailConfig,
            ],
            validationSchema: Joi.object({
                ...appConfigValidationSchema,
                ...databaseConfigValidationSchema,
                ...redisConfigValidationSchema,
                ...jwtConfigValidationSchema,
                ...mailConfigValidationSchema,
            }),
        }),
    ],
})
export class NestConfigModule {}

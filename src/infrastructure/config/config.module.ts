import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

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

const validationSchema = Joi.object({
    ...appConfigValidationSchema,
    ...databaseConfigValidationSchema,
    ...redisConfigValidationSchema,
    ...jwtConfigValidationSchema,
    ...mailConfigValidationSchema,
});

const load = [appConfig, databaseConfig, redisConfig, jwtConfig, mailConfig];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            load,
            validationSchema,
        }),
    ],
})
export class NestConfigModule {}

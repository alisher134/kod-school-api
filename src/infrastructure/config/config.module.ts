import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { isDev } from '@common/utils';

import { appConfig, appConfigValidationSchema } from './configs';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: isDev ? '.env.development' : '.env.production',
            load: [appConfig],
            validationSchema: Joi.object({
                ...appConfigValidationSchema,
            }),
        }),
    ],
})
export class NestConfigModule {}

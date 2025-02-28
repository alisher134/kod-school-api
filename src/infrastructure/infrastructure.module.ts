import { Module } from '@nestjs/common';

import { NestConfigModule } from './config';
import { NestI18nModule } from './i18n';
import { MailModule } from './mail/mail.module';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';
import { NestThrottleModule } from './throttle';

@Module({
    imports: [
        NestConfigModule,
        NestI18nModule,
        NestThrottleModule,
        PrismaModule,
        RedisModule,
        MailModule,
    ],
})
export class InfrastructureModule {}

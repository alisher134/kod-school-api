import { Module } from '@nestjs/common';

import { NestConfigModule } from './config';
import { NestI18nModule } from './i18n';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Module({
    imports: [NestConfigModule, PrismaModule, RedisModule, NestI18nModule],
})
export class InfrastructureModule {}

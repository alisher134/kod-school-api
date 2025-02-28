import { Module } from '@nestjs/common';

import { NestConfigModule } from './config';
import { PrismaModule } from './prisma';
import { RedisModule } from './redis';

@Module({
    imports: [NestConfigModule, PrismaModule, RedisModule],
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';

import { NestConfigModule } from './config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [NestConfigModule, PrismaModule],
})
export class InfrastructureModule {}

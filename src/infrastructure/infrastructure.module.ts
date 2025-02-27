import { Module } from '@nestjs/common';

import { NestConfigModule } from './config';

@Module({
    imports: [NestConfigModule],
})
export class InfrastructureModule {}

import { Module } from '@nestjs/common';

import { InfrastructureModule } from '@infrastructure/infrastructure.module';

import { ModulesModule } from '@modules/modules.module';

@Module({
    imports: [InfrastructureModule, ModulesModule],
})
export class AppModule {}

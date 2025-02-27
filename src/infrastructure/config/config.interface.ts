import { ConfigType } from '@nestjs/config';

import { appConfig, databaseConfig, redisConfig } from './configs';

export interface IConfigs {
    app: ConfigType<typeof appConfig>;
    database: ConfigType<typeof databaseConfig>;
    redis: ConfigType<typeof redisConfig>;
}

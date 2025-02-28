import { ConfigType } from '@nestjs/config';

import { appConfig, databaseConfig, jwtConfig, redisConfig } from './configs';

export interface IConfigs {
    app: ConfigType<typeof appConfig>;
    database: ConfigType<typeof databaseConfig>;
    redis: ConfigType<typeof redisConfig>;
    jwt: ConfigType<typeof jwtConfig>;
}

import { ConfigType } from '@nestjs/config';

import { appConfig } from './configs/app.config';

export interface IConfigs {
    app: ConfigType<typeof appConfig>;
}

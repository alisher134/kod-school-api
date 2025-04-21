import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { isDev, isProd } from '@common/utils';

import { IConfigs } from '@infrastructure/config';

export async function bootstrap(app: INestApplication): Promise<void> {
    const logger = new Logger('Bootstrap');
    const configService = app.get(ConfigService<IConfigs, true>);

    app.use(cookieParser());
    app.use(
        helmet({
            hidePoweredBy: true, // Отключаем заголовок X-Powered-By
            noSniff: true, // Отключаем MIME-сниффинг
            frameguard: {
                action: 'sameorigin',
            },
            contentSecurityPolicy: {
                directives: {
                    frameAncestors: ["'self'"], // Разрешаем встраивание только с того же домена
                },
            },
        }),
    );

    app.use(compression());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidUnknownValues: isProd,
            enableDebugMessages: isDev,
        }),
    );

    const globalPrefix = configService.get('app.prefix', { infer: true });
    app.setGlobalPrefix(globalPrefix);

    app.enableShutdownHooks(['SIGTERM', 'SIGINT']);

    app.enableCors({
        origin: configService.get('app.allowedOrigin', { infer: true }),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
    });

    const port = configService.get('app.port', { infer: true });
    const host = `http://localhost:${port}`;
    logger.log(`🚀 Application is running on: ${host}/${globalPrefix}`);

    await app.listen(port);
}

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
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: ["'self'"], // Без 'unsafe-inline', использовать nonce или хеши
                    styleSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https://api.kodschool.kz'],
                    connectSrc: [
                        "'self'",
                        'https://api.kodschool.kz',
                        'https://kodschool.kz',
                    ],
                    fontSrc: ["'self'"],
                    objectSrc: ["'none'"],
                    mediaSrc: ["'self'"],
                    frameSrc: ["'none'"],
                    upgradeInsecureRequests: [],
                },
            },
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
            xssFilter: true,
            noSniff: true,
            hsts: {
                maxAge: 31536000,
                includeSubDomains: true,
                preload: true,
            },
            frameguard: { action: 'sameorigin' },
            hidePoweredBy: true,
            permittedCrossDomainPolicies: { permittedPolicies: 'none' },
            crossOriginEmbedderPolicy: { policy: 'credentialless' },
            crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
            crossOriginResourcePolicy: { policy: 'cross-origin' },
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

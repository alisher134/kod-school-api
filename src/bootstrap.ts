import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { IConfigs } from '@infrastructure/config';

export async function bootstrap(app: INestApplication): Promise<void> {
    const logger = new Logger('Bootstrap');
    const configService = app.get(ConfigService<IConfigs, true>);

    app.use(cookieParser());
    app.use(
        helmet({
            // Content Security Policy (CSP) to prevent XSS and other attacks
            contentSecurityPolicy: {
                useDefaults: true, // Use helmet's default secure policies
                directives: {
                    defaultSrc: ["'self'"], // Default to same-origin only
                    scriptSrc: ["'self'"], // Scripts only from same origin (add nonce or hashes if needed)
                    styleSrc: ["'self'"], // Styles only from same origin
                    imgSrc: ["'self'", 'data:', 'https://api.kodschool.kz'], // Allow images from these sources
                    connectSrc: [
                        "'self'",
                        'https://api.kodschool.kz',
                        'https://kodschool.kz',
                    ], // Allow API calls to these origins
                    fontSrc: ["'self'"], // Fonts only from same origin
                    objectSrc: ["'none'"], // Disallow <object> tags (prevents Flash, etc.)
                    mediaSrc: ["'self'"], // Media (audio, video) only from same origin
                    frameSrc: ["'none'"], // Disallow iframes unless explicitly needed
                    baseUri: ["'self'"], // Restrict <base> tag to same origin
                    formAction: ["'self'"], // Restrict form submissions to same origin
                    frameAncestors: ["'none'"], // Prevent clickjacking by disallowing framing
                },
            },
            // Referrer Policy: Only send referrer for same-origin requests or cross-origin HTTPS
            referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
            // Enable XSS-Protection header (for older browsers)
            xssFilter: true,
            // Prevent MIME-type sniffing (fixes "X-Content-Type-Options missing" alerts)
            noSniff: true,
            // HTTP Strict Transport Security (HSTS) to enforce HTTPS
            hsts: {
                maxAge: 31536000, // 1 year
                includeSubDomains: false, // Set to true only if all subdomains are HTTPS-ready
                preload: false, // Set to true only if you're ready to submit to preload lists
            },
            // Prevent framing for clickjacking protection
            frameguard: { action: 'deny' }, // Stronger than 'sameorigin'
            // Remove X-Powered-By header to reduce information disclosure
            hidePoweredBy: true,
            // Restrict cross-domain policies for Flash and PDF
            permittedCrossDomainPolicies: { permittedPolicies: 'none' },
            // Cross-Origin policies (fixes "Cross-origin non-critical configuration" alert)
            crossOriginEmbedderPolicy: { policy: 'require-corp' }, // Require CORP for embedded resources
            crossOriginOpenerPolicy: { policy: 'same-origin' }, // Prevent cross-origin window access
            crossOriginResourcePolicy: { policy: 'cross-origin' }, // Restrict resource sharing to same origin
        }),
    );

    app.use(compression());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidUnknownValues: true,
            forbidNonWhitelisted: true,
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

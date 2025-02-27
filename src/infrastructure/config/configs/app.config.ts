import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const appConfigValidationSchema = {
    NODE_ENV: Joi.string().valid('development', 'production').required(),
    APP_PORT: Joi.number().port().required(),
    APP_PREFIX: Joi.string().required(),
    APP_URL: Joi.string().required(),
    ALLOWED_ORIGIN: Joi.string().required(),
    DOMAIN: Joi.string().required(),
    THROTTLE_LIMIT: Joi.number().positive().required(),
    THROTTLE_TTL: Joi.number().positive().required(),
};

export const appConfig = registerAs('app', () => ({
    nodeEnv: process.env.NODE_ENV,
    port: parseInt(process.env.APP_PORT || '3000'),
    prefix: process.env.APP_PREFIX || 'api',
    url: process.env.APP_URL,
    allowedOrigin: process.env.ALLOWED_ORIGINS,
    domain: process.env.DOMAIN || 'localhost',
    throttleLimit: parseInt(process.env.THROTTLE_LIMIT),
    throttleTtl: parseInt(process.env.THROTTLE_TTL),
}));

import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const redisConfigValidationSchema = {
    REDIS_HOST: Joi.string().hostname().required(),
    REDIS_PORT: Joi.number().port().required(),
    REDIS_PASSWORD: Joi.string().min(8).required(),
};

export const redisConfig = registerAs('redis', () => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
}));

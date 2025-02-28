import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const jwtConfigValidationSchema = {
    JWT_ACCESS_EXPIRE: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_EXPIRE: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_RESTORE_EXPIRE: Joi.string().required(),
    JWT_RESTORE_SECRET: Joi.string().required(),
};

export const jwtConfig = registerAs('jwt', () => ({
    accessExpire: process.env.JWT_ACCESS_EXPIRE,
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    restoreExpire: process.env.JWT_RESTORE_EXPIRE,
    restoreSecret: process.env.JWT_RESTORE_SECRET,
}));

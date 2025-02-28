import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const mailConfigValidationSchema = {
    MAIL_HOST: Joi.string().required(),
    MAIL_PORT: Joi.number().required(),
    MAIL_USER: Joi.string().required(),
    MAIL_PASS: Joi.string().required(),
    MAIL_FROM: Joi.string().required(),
};

export const mailConfig = registerAs('mail', () => ({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM,
}));

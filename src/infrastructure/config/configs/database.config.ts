import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export const databaseConfigValidationSchema = {
    POSTGRES_HOST: Joi.string().hostname().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().min(8).required(),
    POSTGRES_DB: Joi.string().required(),
};

export const databaseConfig = registerAs('database', () => ({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    db: process.env.POSTGRES_DB,
}));

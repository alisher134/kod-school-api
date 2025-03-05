import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';

import { IConfigs } from '@infrastructure/config';

@Injectable()
export class RedisService
    extends Redis
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(RedisService.name);

    constructor(private readonly configService: ConfigService<IConfigs, true>) {
        const redisOptions: RedisOptions = {
            host: configService.get('redis.host', { infer: true }),
            port: configService.get('redis.port', { infer: true }),
            password: configService.get('redis.password', { infer: true }),
        };
        super(redisOptions);
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.ping();
            this.logger.log('🟢 Redis connected successfully');
        } catch (error) {
            this.logger.error('❌ Failed to connect to Redis:', error);
            process.exit(1);
        }
    }

    async onModuleDestroy(): Promise<void> {
        try {
            this.disconnect();
            this.logger.log('🔴 Redis connection closed successfully.');
        } catch (error) {
            this.logger.error(
                '⚠️ Error while shutting down Redis connection',
                error,
            );
        }
    }
}

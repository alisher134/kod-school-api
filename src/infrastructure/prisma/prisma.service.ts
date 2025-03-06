import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/generated';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit(): Promise<void> {
        try {
            await this.$connect();
            this.logger.log('🟢 Connection to database successful.');
        } catch (error) {
            this.logger.error('❌ Failed to connect to the database.', error);
            process.exit(1);
        }
    }

    async onModuleDestroy(): Promise<void> {
        try {
            await this.$disconnect();
            this.logger.log('🔴 Database connection closed successfully.');
        } catch (error) {
            this.logger.error('⚠️ Error closing database connection.', error);
        }
    }
}

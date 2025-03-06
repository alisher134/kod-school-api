import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { bootstrap } from './bootstrap';

async function main(): Promise<void> {
    const logger = new Logger('Bootstrap');
    let app: INestApplication;

    try {
        app = await NestFactory.create(AppModule);

        await bootstrap(app);
    } catch (error) {
        logger.error('❌ Error during bootstrap:', error);
        if (app) await app.close();
        process.exit(1);
    }
}
main();

import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { IConfigs } from '@infrastructure/config';

import { MailController } from './mail.controller';
import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (
                configService: ConfigService<IConfigs, true>,
            ) => ({
                transport: {
                    host: configService.get('mail.host', { infer: true }),
                    port: configService.get('mail.port', { infer: true }),
                    secure: false,
                    auth: {
                        user: configService.get('mail.user', { infer: true }),
                        pass: configService.get('mail.pass', { infer: true }),
                    },
                },
                defaults: {
                    from: `"No Reply" <${configService.get('mail.from', { infer: true })}>`,
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (
                configService: ConfigService<IConfigs, true>,
            ) => ({
                connection: {
                    host: configService.get('redis.host', { infer: true }),
                    port: configService.get('redis.port', { infer: true }),
                    password: configService.get('redis.password', {
                        infer: true,
                    }),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: 'mail-queue',
        }),
    ],
    controllers: [MailController],
    providers: [MailService, MailProcessor],
    exports: [MailService],
})
export class MailModule {}

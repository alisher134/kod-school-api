import { InjectQueue } from '@nestjs/bullmq';
import { Controller, Get, Post } from '@nestjs/common';
import { Queue } from 'bullmq';

import { IMailJob } from './mail.interface';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(
        private readonly mailService: MailService,
        @InjectQueue('mail-queue') private mailQueue: Queue,
    ) {}

    @Post()
    mail(): Promise<void> {
        const mailData: IMailJob = {
            to: 'admin@gmail.com',
            subject: 'Hello World',
            html: '<h1>Hello World</h1>',
        };

        return this.mailService.sendEmail(
            mailData.to,
            mailData.subject,
            mailData.html,
        );
    }

    @Get('jobs')
    async getJobs() {
        const waiting = await this.mailQueue.getWaiting();
        const failed = await this.mailQueue.getFailed();
        return { waiting, failed };
    }
}

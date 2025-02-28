import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { IMailJob } from './mail.interface';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
        @InjectQueue('mail-queue') private mailQueue: Queue,
    ) {}

    async sendEmail(to: string, subject: string, body: string): Promise<void> {
        const mailData: IMailJob = {
            to,
            subject,
            html: body,
        };

        await this.mailQueue.add('send-mail', mailData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });
    }

    async processMail(job: IMailJob): Promise<void> {
        await this.mailerService.sendMail({
            to: job.to,
            subject: job.subject,
            html: job.html,
        });
    }
}

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { IMailJob } from './mail.interface';
import { MailService } from './mail.service';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job<IMailJob>): Promise<void> {
        if (job.name === 'send-mail')
            await this.mailService.processMail(job.data);
    }
}

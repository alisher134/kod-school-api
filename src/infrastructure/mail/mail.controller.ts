import { Controller, Post } from '@nestjs/common';

import { IMailJob } from './mail.interface';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) {}

    @Post()
    mail() {
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
}

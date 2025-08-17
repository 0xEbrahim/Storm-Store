import { MailerService } from '@nestjs-modules/mailer';
import ejs from 'ejs';
import { Injectable } from '@nestjs/common';

export interface EmailType {
  from: string;
  to: string;
  subject: string;
  template: string;
  data: object;
}

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendMail({ from, subject, template, to, data }: EmailType) {
    await this.mailService.sendMail({
      from,
      to,
      subject,
      html: await ejs.renderFile(template, data),
    });
  }
}

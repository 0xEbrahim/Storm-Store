import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from 'src/modules/email/email.service';

@Processor('email', { concurrency: 5 })
export class EmailProcessor extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }
  async process(job: Job, token?: string): Promise<any> {
    await this.emailService.sendMail(job.data);
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`Job with id: ${job.id} is active right now`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`Job with id: ${job.id} is completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    console.log(`Job with id: ${job.id} failed`);
    console.log(`Attempts number : ${job.attemptsMade}`);
  }
}

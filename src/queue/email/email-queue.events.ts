import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@QueueEventsListener('email')
export class EmailQueueEventsListener extends QueueEventsHost {
  logger = new Logger('Queue');

  @OnQueueEvent('added')
  onAddedd(job: Job) {
    this.logger.log(`Job with id ${job.id} has been added to the queue`);
  }
}

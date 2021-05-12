import { Logger } from '@nestjs/common';
import { Job, Queue  } from 'bull';
import { BullQueueEvents, OnQueueActive, OnQueueError, OnQueueEvent, Processor} from '@nestjs/bull';

@Processor('scan-queue')
export class QueueFeedback {
  private readonly logger = new Logger('QueueFeedback');

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
  }

  @OnQueueEvent(BullQueueEvents.COMPLETED)
  onCompleted(job: Job) {
    this.logger.log(`Completed job ${job.id} of type ${job.name} with result ${JSON.stringify(job.returnvalue)}`);
  }

  @OnQueueError()
  onError(job: Job) {
    this.logger.log(`Error job ${job.id} of type ${job.name} with result ${JSON.stringify(job.returnvalue)}`);
  }
}

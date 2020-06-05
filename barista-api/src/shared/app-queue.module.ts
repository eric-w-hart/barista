import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

const AppQueueModuleDefinition = BullModule.registerQueue({
  name: 'scan-queue',
  redis: {
    enableReadyCheck: true,
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

@Module({
  imports: [AppQueueModuleDefinition],
  exports: [AppQueueModuleDefinition],
})
export class AppQueueModule {}

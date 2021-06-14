import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';

const AppQueueModuleDefinitionQueue = BullModule.registerQueue({
  name: 'scan-queue',
});

const AppQueueModuleDefinition = BullModule.forRoot({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

@Module({
  imports: [AppQueueModuleDefinition, AppQueueModuleDefinitionQueue],
  exports: [AppQueueModuleDefinition, AppQueueModuleDefinitionQueue],
})
export class AppQueueModule {}

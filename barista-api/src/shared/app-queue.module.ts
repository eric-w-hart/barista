import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

const AppQueueModuleDefinition = BullModule.registerQueue({
  name: 'scan-queue',
});

@Module({
  imports: [AppQueueModuleDefinition],
  exports: [AppQueueModuleDefinition],
})
export class AppQueueModule {}

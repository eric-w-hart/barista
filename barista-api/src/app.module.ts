import { AppService } from '@app/app.service';
import { ControllersModule } from '@app/controllers/controllers.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';
import { AppQueueModule } from './shared/app-queue.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forRoot(), ControllersModule, AppQueueModule, ServicesModule,    
    BullModule.forRoot({
      redis: {
      enableReadyCheck: true,
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      },
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

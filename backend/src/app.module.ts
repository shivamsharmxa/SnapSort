import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WatcherModule } from './watcher/watcher.module';
import { OcrModule } from './ocr/ocr.module';
import { ClassifierModule } from './classifier/classifier.module';
import { AiModule } from './ai/ai.module';
import { OrganizerModule } from './organizer/organizer.module';

@Module({
  imports: [
    WatcherModule,
    OcrModule,
    ClassifierModule,
    AiModule,
    OrganizerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

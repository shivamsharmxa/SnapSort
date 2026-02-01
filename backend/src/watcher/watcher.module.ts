import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { OcrModule } from '../ocr/ocr.module';
import { ClassifierModule } from '../classifier/classifier.module';
import { AiModule } from '../ai/ai.module';
import { OrganizerModule } from '../organizer/organizer.module';

@Module({
  imports: [OcrModule, ClassifierModule, AiModule, OrganizerModule], // 👈 THIS IS THE FIX
  providers: [WatcherService],
})
export class WatcherModule {}
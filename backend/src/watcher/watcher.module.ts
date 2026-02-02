import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { OcrModule } from '../ocr/ocr.module';
import { ClassifierModule } from '../classifier/classifier.module';
import { AiModule } from '../ai/ai.module';
import { OrganizerModule } from '../organizer/organizer.module';
import { HistoryModule } from '../history/history.module';
import { DecisionModule } from '../decision/decision.module';

@Module({
  imports: [OcrModule, ClassifierModule, AiModule, OrganizerModule, HistoryModule, DecisionModule], // 👈 THIS IS THE FIX
  providers: [WatcherService],
})
export class WatcherModule {}
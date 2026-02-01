import { Module } from '@nestjs/common';
import { WatcherService } from './watcher.service';
import { OcrModule } from '../../ocr/ocr.module';

@Module({
  imports: [OcrModule], // 👈 THIS IS THE FIX
  providers: [WatcherService],
})
export class WatcherModule {}
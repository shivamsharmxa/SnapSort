import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WatcherModule } from './watcher/watcher.module';
import { OcrModule } from '../ocr/ocr.module';

@Module({
  imports: [WatcherModule, OcrModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

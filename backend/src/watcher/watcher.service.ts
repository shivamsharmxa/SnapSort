import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { OcrService } from '../../ocr/ocr.service';

@Injectable()
export class WatcherService implements OnModuleInit {
  private lastScanTime = Date.now();

  constructor(private readonly ocrService: OcrService) {}

  onModuleInit() {
    console.log('🚀 Watcher Service Initialized');
    const folder = this.getScreenshotFolder();
    this.startPolling(folder);
  }

  /**
   * Detect screenshot folder (macOS)
   */
  private getScreenshotFolder(): string {
    return path.join(os.homedir(), 'Desktop');
  }

  /**
   * Poll folder every second to detect new screenshots
   */
  private startPolling(folder: string) {
    console.log('👀 Polling folder:', folder);

    setInterval(async () => {
      try {
        const files = fs.readdirSync(folder);

        for (const file of files) {
          const fullPath = path.join(folder, file);
          const stats = fs.statSync(fullPath);

          // Only process NEW files
          if (stats.birthtimeMs > this.lastScanTime) {
            if (this.isScreenshot(file)) {
              console.log('📸 Screenshot detected:', fullPath);

              // OCR PROCESS
              const extractedText =
                await this.ocrService.extractText(fullPath);

              console.log('🧠 Extracted Text:\n', extractedText);
            }
          }
        }

        this.lastScanTime = Date.now();
      } catch (error) {
        if (error instanceof Error) {
          console.error('❌ Error scanning folder:', error.message);
        } else {
          console.error('❌ Unknown error occurred');
        }
      }
    }, 1000);
  }

  /**
   * Check if file is a screenshot
   */
  private isScreenshot(fileName: string): boolean {
    const name = fileName.toLowerCase();

    return (
      (name.includes('screenshot') ||
        name.includes('screen shot') ||
        name.includes('snip')) &&
      (name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg'))
    );
  }
}

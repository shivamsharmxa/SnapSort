import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class WatcherService implements OnModuleInit {
  private lastScanTime = Date.now();

  onModuleInit() {
    console.log('🚀 Watcher Service Initialized');
    const folder = this.getScreenshotFolder();
    this.startPolling(folder);
  }

  private getScreenshotFolder(): string {
    return path.join(os.homedir(), 'Desktop');
  }

  private startPolling(folder: string) {
    console.log('👀 Polling folder:', folder);

    setInterval(() => {
      try {
        const files = fs.readdirSync(folder);

        for (const file of files) {
          const fullPath = path.join(folder, file);
          const stats = fs.statSync(fullPath);

          if (stats.birthtimeMs > this.lastScanTime) {
            if (this.isScreenshot(file)) {
              console.log(' Screenshot detected:', fullPath);
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


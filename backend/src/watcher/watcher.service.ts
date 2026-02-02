import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { OcrService } from '../ocr/ocr.service';
import { ClassifierService } from '../classifier/classifier.service';
import { AiService } from '../ai/ai.service';
import { OrganizerService } from '../organizer/organizer.service';
import { HistoryService } from '../history/history.service';
import { DecisionService } from '../decision/decision.service';

@Injectable()
export class WatcherService implements OnModuleInit {
  private lastScanTime = Date.now();
  private processing = new Set<string>();

  // 🔥 Toggle this later from UI
  private readonly DRY_RUN = false;

  constructor(
    private readonly ocrService: OcrService,
    private readonly classifierService: ClassifierService,
    private readonly aiService: AiService,
    private readonly organizerService: OrganizerService,
    private readonly historyService: HistoryService,
    private readonly decisionService: DecisionService
  ) {}

  onModuleInit() {
    console.log('🚀 Watcher Service Initialized');
    this.startPolling(this.getScreenshotFolder());
  }

  private getScreenshotFolder(): string {
    return path.join(os.homedir(), 'Desktop');
  }

  private startPolling(folder: string) {
    console.log('👀 Polling folder:', folder);

    setInterval(async () => {
      try {
        const files = await fs.readdir(folder);

        for (const file of files) {
          const fullPath = path.join(folder, file);

          if (this.processing.has(fullPath)) continue;

          const stats = await fs.stat(fullPath);

          if (
            stats.birthtimeMs > this.lastScanTime &&
            this.isScreenshot(file)
          ) {
            this.processing.add(fullPath);
            await this.handleScreenshot(fullPath);
            this.processing.delete(fullPath);
          }
        }

        this.lastScanTime = Date.now();
      } catch (error) {
        console.error(
          '❌ Watcher error:',
          error instanceof Error ? error.message : error
        );
      }
    }, 1000);
  }

  private async handleScreenshot(fullPath: string) {
    try {
      console.log('\n📸 Screenshot detected:', fullPath);

      // 1️⃣ OCR
      const extractedText =
        await this.ocrService.extractText(fullPath);

      console.log('🧠 OCR Text:', extractedText);

      // 2️⃣ Rule-based classification
      const ruleCategory =
        this.classifierService.classify(extractedText);

      console.log('📂 Rule-based:', ruleCategory);

      // 3️⃣ AI classification
      const aiCategory =
        await this.aiService.classify(extractedText);

      console.log('🤖 AI category:', aiCategory);

      // 4️⃣ Hybrid decision
      const decision =
        this.decisionService.decide(
          ruleCategory,
          aiCategory
        );

      console.log(
        `🧠 Final decision: ${decision.category} (${Math.round(
          decision.confidence * 100
        )}%) via ${decision.source}`
      );

      // 🧪 Dry run mode (no file move)
      if (this.DRY_RUN) {
        console.log(
          `🧪 DRY RUN → Would move screenshot to "${decision.category}"`
        );
        return;
      }

      // 5️⃣ Organize (move + rename)
      const { newPath, originalPath } =
        this.organizerService.organize(
          fullPath,
          decision.category
        );

      // 6️⃣ Save history
      this.historyService.save({
        originalPath,
        newPath,
        category: decision.category,
        timestamp: Date.now(),
      });

      console.log('📁 Saved to:', newPath);
    } catch (error) {
      console.error(
        '❌ Processing failed:',
        error instanceof Error ? error.message : error
      );
    }
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

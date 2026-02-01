import { Injectable } from '@nestjs/common';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  async extractText(imagePath: string): Promise<string> {
    const worker = await createWorker('eng');

    const {
      data: { text },
    } = await worker.recognize(imagePath);

    await worker.terminate();
    return text;
  }
}

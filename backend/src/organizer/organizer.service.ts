import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FilenameService } from '../ai/filename.service';

@Injectable()
export class OrganizerService {
  constructor(private readonly filenameService: FilenameService) {}
  private baseDir = path.join(os.homedir(), 'Desktop', 'Screenshots');

  private categoryMap: Record<string, string> = {
    code: 'Code',
    error: 'Errors',
    chat: 'Chat',
    ui: 'UI',
    document: 'Documents',
    other: 'Other',
  };

  async organize(
    originalPath: string,
    category: string,
    extractedText: string = ''
  ): Promise<{ newPath: string; originalPath: string }> {
    const folderMap: Record<string, string> = {
      code: 'Code',
      error: 'Errors',
      chat: 'Chat',
      ui: 'UI',
      document: 'Documents',
      other: 'Other',
    };

    const folder =
      folderMap[category] || 'Other';

    const baseDir = path.join(
      os.homedir(),
      'Desktop',
      'Screenshots',
      folder
    );

    if (!existsSync(baseDir)) {
      await fs.mkdir(baseDir, { recursive: true });
    }

    // Generate smart filename using AI + rules
    const baseFilename = await this.filenameService.generateFilename(
      extractedText,
      category,
    );

    // Add short timestamp for uniqueness
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;

    const ext = path.extname(originalPath);
    const filename = `${baseFilename}_${timeStr}${ext}`;

    const newPath = path.join(baseDir, filename);

    await fs.rename(originalPath, newPath);

    return { newPath, originalPath };
  }
}


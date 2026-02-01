import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class OrganizerService {
  private baseDir = path.join(os.homedir(), 'Desktop', 'Screenshots');

  private categoryMap: Record<string, string> = {
    code: 'Code',
    error: 'Errors',
    chat: 'Chat',
    ui: 'UI',
    document: 'Documents',
    unknown: 'Others',
  };

  organize(
    originalPath: string,
    category: string,
    extractedText: string
  ): string {
    const folderName =
      this.categoryMap[category] || 'Others';

    const folderPath = path.join(this.baseDir, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const cleanName = this.generateCleanName(
      category,
      extractedText
    );

    const ext = path.extname(originalPath);
    const newFileName = `${cleanName}${ext}`;
    const newPath = path.join(folderPath, newFileName);

    fs.renameSync(originalPath, newPath);

    return newPath;
  }

  private generateCleanName(
    category: string,
    text: string
  ): string {
    const words = text
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .split(' ')
      .slice(0, 5)
      .join('_')
      .toLowerCase();

    const date = new Date()
      .toISOString()
      .slice(0, 16)
      .replace('T', '_')
      .replace(':', '-');

    return `${category}_${words || 'screenshot'}_${date}`;
  }
}

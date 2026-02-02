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
    category: string
  ): { newPath: string; originalPath: string } {
    const folderMap: Record<string, string> = {
      code: 'Code',
      error: 'Errors',
      chat: 'Chat',
      ui: 'UI',
      document: 'Documents',
      unknown: 'Others',
    };
  
    const folder =
      folderMap[category] || 'Others';
  
    const baseDir = path.join(
      os.homedir(),
      'Desktop',
      'Screenshots',
      folder
    );
  
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
  
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, '-');
  
    const ext = path.extname(originalPath);
    const newPath = path.join(
      baseDir,
      `${category}_${timestamp}${ext}`
    );
  
    fs.renameSync(originalPath, newPath);
  
    return { newPath, originalPath };
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

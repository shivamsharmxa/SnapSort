import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface HistoryEntry {
  originalPath: string;
  newPath: string;
  category: string;
  timestamp: number;
}

export class HistoryService {
  private historyFile = path.join(
    os.homedir(),
    'Desktop',
    'Screenshots',
    '.snapsort-history.json'
  );

  save(entry: HistoryEntry) {
    const history = this.read();
    history.push(entry);
    fs.writeFileSync(
      this.historyFile,
      JSON.stringify(history, null, 2)
    );
  }

  read(): HistoryEntry[] {
    if (!fs.existsSync(this.historyFile)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(this.historyFile, 'utf-8'));
  }

  undoLast(): HistoryEntry | null {
    const history = this.read();
    const last = history.pop();

    if (!last) return null;

    fs.renameSync(last.newPath, last.originalPath);

    fs.writeFileSync(
      this.historyFile,
      JSON.stringify(history, null, 2)
    );

    return last;
  }
}

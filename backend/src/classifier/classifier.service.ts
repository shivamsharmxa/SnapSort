import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassifierService {
  classify(text: string): string {
    const lower = text.toLowerCase();

    if (this.isCode(lower)) return 'code';
    if (this.isError(lower)) return 'error';
    if (this.isChat(lower)) return 'chat';
    if (this.isText(lower)) return 'text';

    return 'unknown';
  }

  private isCode(text: string): boolean {
    return (
      text.includes('function') ||
      text.includes('const ') ||
      text.includes('let ') ||
      text.includes('=>') ||
      text.includes('{') ||
      text.includes(';')
    );
  }

  private isError(text: string): boolean {
    return (
      text.includes('error') ||
      text.includes('exception') ||
      text.includes('failed') ||
      text.includes('stack trace')
    );
  }

  private isChat(text: string): boolean {
    return (
      text.includes(':') &&
      text.split('\n').length > 2
    );
  }

  private isText(text: string): boolean {
    return text.length > 20;
  }
}

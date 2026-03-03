import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassifierService {
  classify(text: string): string {
    const lower = text.toLowerCase();
    
    // If OCR text is garbage (too short or too noisy), default to 'other'
    if (this.isGarbageOCR(text)) {
      return 'other';
    }

    // Order matters - check most specific first
    if (this.isCode(lower)) return 'code';
    if (this.isError(lower)) return 'error';
    if (this.isChat(lower)) return 'chat';
    if (this.isDocument(lower)) return 'document';
    if (this.isUI(lower)) return 'ui';

    return 'other';
  }

  /**
   * Detect if OCR output is likely garbage/noise
   */
  private isGarbageOCR(text: string): boolean {
    // Too short to be meaningful
    if (text.length < 15) return true;
    
    // Too many non-alphanumeric characters (OCR noise)
    const alphanumeric = text.replace(/[^a-zA-Z0-9]/g, '');
    const ratio = alphanumeric.length / text.length;
    if (ratio < 0.4) return true; // Less than 40% readable chars
    
    // Excessive random characters
    const hasExcessiveNoise = /[~`!@#$%^&*]{3,}/.test(text);
    if (hasExcessiveNoise) return true;
    
    return false;
  }

  private isCode(text: string): boolean {
    // Require MULTIPLE code indicators (more strict)
    let codeScore = 0;
    
    if (text.includes('function ')) codeScore += 2;
    if (text.includes('const ')) codeScore += 2;
    if (text.includes('let ')) codeScore += 2;
    if (text.includes('var ')) codeScore += 2;
    if (text.includes('import ')) codeScore += 2;
    if (text.includes('export ')) codeScore += 2;
    if (text.includes('class ')) codeScore += 2;
    if (text.includes('return ')) codeScore += 1;
    if (text.includes('=>')) codeScore += 1;
    if (text.match(/\{[\s\S]*\}/)) codeScore += 1; // Has braces with content
    if (text.includes(';') && text.split(';').length > 2) codeScore += 1;
    
    // Need at least 3 points to be confident it's code
    return codeScore >= 3;
  }

  private isError(text: string): boolean {
    // More specific error patterns
    const hasErrorKeyword = 
      text.includes('error:') ||
      text.includes('exception:') ||
      text.includes('traceback') ||
      text.includes('stack trace') ||
      /error\s+at\s+/i.test(text) ||
      /\w+error:/i.test(text); // e.g., "TypeError:", "RuntimeError:"
    
    const hasStackTrace = 
      text.includes('at ') && 
      text.includes('(') && 
      text.includes(')');
    
    return hasErrorKeyword || hasStackTrace;
  }

  private isChat(text: string): boolean {
    // Much more strict - require clear conversational patterns
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    
    // Need at least 3 lines
    if (lines.length < 3) return false;
    
    // Check for conversational patterns: "Name: message"
    const conversationalPattern = /^[A-Z][a-zA-Z\s]{1,20}:/;
    const conversationalLines = lines.filter(l => conversationalPattern.test(l.trim()));
    
    // At least 40% of lines should follow conversational pattern
    if (conversationalLines.length >= lines.length * 0.4) {
      return true;
    }
    
    // Alternative: Check for common chat keywords
    const chatKeywords = ['said:', 'wrote:', 'replied:', 'messaged:'];
    const hasChatKeywords = chatKeywords.some(kw => text.includes(kw));
    
    return hasChatKeywords;
  }

  private isDocument(text: string): boolean {
    // Clear prose/document indicators
    const hasGoodLength = text.length > 100;
    const hasParagraphs = text.split('\n\n').length > 1;
    const hasProperSentences = text.split('. ').length > 3;
    
    // Check for common document words
    const documentWords = ['the', 'and', 'that', 'with', 'this', 'from', 'have', 'will'];
    const wordCount = documentWords.filter(w => text.includes(` ${w} `)).length;
    
    return hasGoodLength && (hasParagraphs || hasProperSentences) && wordCount >= 3;
  }

  private isUI(text: string): boolean {
    // UI-specific keywords (keep loose as fallback before 'other')
    const uiKeywords = [
      'login', 'signup', 'sign up', 'sign in',
      'dashboard', 'settings', 'profile',
      'submit', 'cancel', 'save changes',
      'username', 'password', 'email address'
    ];
    
    const matches = uiKeywords.filter(kw => text.includes(kw)).length;
    
    // Need at least 2 UI keywords to be confident
    return matches >= 2;
  }
}

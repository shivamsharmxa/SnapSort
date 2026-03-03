import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FilenameService {
  private readonly logger = new Logger(FilenameService.name);
  private readonly OLLAMA_URL = 'http://localhost:11434/api/generate';
  private readonly OLLAMA_TIMEOUT = 5000; // 5 seconds
  private readonly MAX_FILENAME_LENGTH = 50;

  /**
   * Generate a smart filename using AI
   * Falls back to rule-based generation if AI fails
   */
  async generateFilename(
    ocrText: string,
    category: string,
  ): Promise<string> {
    // Step 1: Clean OCR text
    const cleanedText = this.cleanOCRText(ocrText);
    
    // Step 2: If text is garbage after cleaning, use fallback immediately
    if (cleanedText.length < 10) {
      this.logger.log('OCR text too short after cleaning, using fallback');
      return this.generateWithRules(cleanedText, category);
    }

    // Step 3: Try AI-based generation
    try {
      const aiFilename = await this.generateWithAI(cleanedText);
      const sanitized = this.sanitizeFilename(aiFilename);
      
      if (this.isValidFilename(sanitized)) {
        this.logger.log(`AI generated filename: ${sanitized}`);
        return this.addTimestamp(sanitized);
      }
    } catch (error) {
      this.logger.warn(`AI filename generation failed: ${error.message}`);
    }

    // Step 4: Fallback to rule-based generation
    this.logger.log('Falling back to rule-based filename generation');
    const ruleBasedName = this.generateWithRules(cleanedText, category);
    return this.addTimestamp(ruleBasedName);
  }

  /**
   * STEP 1: Clean OCR text before sending to AI
   */
  private cleanOCRText(text: string): string {
    let cleaned = text;

    // Remove URLs
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
    
    // Remove email addresses
    cleaned = cleaned.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    
    // Remove special symbols but keep basic punctuation
    cleaned = cleaned.replace(/[^\w\s.,:;!?-]/g, ' ');
    
    // Remove single characters (noise)
    cleaned = cleaned.replace(/\b\w\b/g, ' ');
    
    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // Limit length (first 200 chars for AI processing)
    cleaned = cleaned.slice(0, 200);
    
    return cleaned;
  }

  /**
   * STEP 4: Sanitize AI/rule output to valid filename
   */
  private sanitizeFilename(filename: string): string {
    let sanitized = filename;

    // Remove any quotes or explanations
    sanitized = sanitized.replace(/["'`]/g, '');
    
    // Extract only the filename part (remove explanations like "Here is: filename")
    const filenameMatch = sanitized.match(/([a-z0-9_]+)/);
    if (filenameMatch) {
      sanitized = filenameMatch[1];
    }
    
    // Lowercase everything
    sanitized = sanitized.toLowerCase();
    
    // Replace spaces with underscores
    sanitized = sanitized.replace(/\s+/g, '_');
    
    // Remove all non-alphanumeric except underscores
    sanitized = sanitized.replace(/[^a-z0-9_]/g, '');
    
    // Remove duplicate underscores
    sanitized = sanitized.replace(/_+/g, '_');
    
    // Remove leading/trailing underscores
    sanitized = sanitized.replace(/^_+|_+$/g, '');
    
    // Limit to first 5 words (split by underscore)
    const words = sanitized.split('_').filter(w => w.length > 0);
    sanitized = words.slice(0, 5).join('_');
    
    // Limit to 40 characters total
    sanitized = sanitized.slice(0, 40);
    
    // Remove trailing underscore if length limit cut mid-word
    sanitized = sanitized.replace(/_+$/, '');
    
    return sanitized || 'screenshot';
  }

  /**
   * Add timestamp suffix: filename_HHMM
   */
  private addTimestamp(filename: string): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${filename}_${hours}${minutes}`;
  }

  /**
   * Generate filename using Ollama AI with strict parsing
   */
  private async generateWithAI(ocrText: string): Promise<string> {
    const prompt = this.buildPrompt(ocrText);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.OLLAMA_TIMEOUT);

    try {
      const response = await fetch(this.OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mistral',
          prompt,
          stream: false,
          options: {
            temperature: 0.3, // Lower temperature for more deterministic output
            top_p: 0.9,
            max_tokens: 50, // Limit response length
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.response.trim();
      
      // Extract only the filename (remove any explanation)
      // AI sometimes says "Here is: filename" or "OUTPUT: filename"
      const lines = aiResponse.split('\n');
      const lastLine = lines[lines.length - 1].trim();
      
      // Try to extract from last line first (usually the actual output)
      let filename = lastLine;
      
      // Remove common prefixes
      filename = filename.replace(/^(output|filename|result|answer):\s*/i, '');
      filename = filename.replace(/^here is:?\s*/i, '');
      filename = filename.replace(/^the filename is:?\s*/i, '');
      
      return filename;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Detect if OCR output is garbage/noise
   */
  private isGarbageOCR(text: string): boolean {
    if (text.length < 15) return true;
    
    const alphanumeric = text.replace(/[^a-zA-Z0-9]/g, '');
    const ratio = alphanumeric.length / text.length;
    if (ratio < 0.4) return true;
    
    return false;
  }

  /**
   * STEP 2: Build STRICT AI prompt for filename generation
   */
  private buildPrompt(ocrText: string): string {
    return `You are a filename generator. Output ONLY a filename, nothing else.

RULES:
1. Max 5 words separated by underscores
2. Lowercase only (a-z, 0-9, underscore)
3. No punctuation, no quotes, no explanations
4. Extract the MAIN topic from the text
5. If unclear, output: other_content

VALID EXAMPLES:
- typeerror_cannot_read_property
- async_function_handle_submit
- deployment_question_chat
- ethereum_gas_fee_explanation
- login_form_username_field

INVALID (DO NOT DO THIS):
- "Here is the filename: login_form" ❌
- Login Form With Username ❌
- login-form-with-username ❌
- This is a screenshot of... ❌

TEXT TO ANALYZE:
${ocrText}

OUTPUT (filename only):`;
  }

  /**
   * Rule-based filename generation (fallback)
   */
  private generateWithRules(text: string, category: string): string {
    const strategies: Record<string, (t: string) => string> = {
      code: (t) => this.extractCodeKeywords(t),
      error: (t) => this.extractErrorKeywords(t),
      chat: (t) => this.extractChatKeywords(t),
      ui: (t) => this.extractUIKeywords(t),
      document: (t) => this.extractDocumentKeywords(t),
      other: () => 'other_screenshot',
    };

    const keywords = strategies[category]?.(text) || 'other_screenshot';
    return this.sanitize(keywords);
  }

  /**
   * Extract keywords from code snippets
   */
  private extractCodeKeywords(text: string): string {
    // Look for function/variable names
    const functionMatch = text.match(
      /(?:function|const|let|class|def|func)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/,
    );
    if (functionMatch) {
      return `code_${this.camelToSnake(functionMatch[1])}`;
    }

    // Look for method calls
    const methodMatch = text.match(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
    if (methodMatch) {
      return `code_${this.camelToSnake(methodMatch[1])}`;
    }

    // Generic code description
    const firstWords = this.extractFirstWords(text, 3);
    return firstWords ? `code_${firstWords}` : 'code_snippet';
  }

  /**
   * Extract keywords from error messages
   */
  private extractErrorKeywords(text: string): string {
    // Extract error type
    const errorMatch = text.match(/([A-Z][a-z]+Error|Exception|EXCEPTION)/i);
    if (errorMatch) {
      const errorType = errorMatch[1].toLowerCase();
      const context = this.extractFirstWords(text.replace(errorMatch[1], ''), 2);
      return context ? `error_${errorType}_${context}` : `error_${errorType}`;
    }

    return 'error_stacktrace';
  }

  /**
   * Extract keywords from chat messages
   */
  private extractChatKeywords(text: string): string {
    // Remove usernames (pattern: "Username: message")
    const cleaned = text.replace(/^[^:]+:\s*/, '');
    const keywords = this.extractFirstWords(cleaned, 4);
    return keywords ? `chat_${keywords}` : 'chat_message';
  }

  /**
   * Extract keywords from UI screenshots
   */
  private extractUIKeywords(text: string): string {
    const keywords = this.extractFirstWords(text, 4);
    return keywords ? `ui_${keywords}` : 'ui_screen';
  }

  /**
   * Extract keywords from documents
   */
  private extractDocumentKeywords(text: string): string {
    const keywords = this.extractFirstWords(text, 5);
    return keywords ? `doc_${keywords}` : 'document';
  }

  /**
   * Extract first N meaningful words from text
   */
  private extractFirstWords(text: string, count: number): string {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2) // Skip short words
      .filter((w) => /^[a-z]/.test(w)) // Must start with letter (not number)
      .filter((w) => !/(.)\1{2,}/.test(w)) // No repeated chars (e.g., 'aaaa')
      .slice(0, count);

    return words.length > 0 ? words.join('_') : '';
  }

  /**
   * Convert camelCase to snake_case
   */
  private camelToSnake(str: string): string {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  /**
   * STEP 3: Validate AI output is a proper filename
   */
  private isValidFilename(filename: string): boolean {
    // Empty check
    if (!filename || filename.length === 0) return false;

    // Must be between 3 and 50 characters
    if (filename.length < 3 || filename.length > 50) return false;

    // Only lowercase alphanumeric and underscores
    if (!/^[a-z0-9_]+$/.test(filename)) return false;

    // No repeated characters (spam detection)
    if (/(.)\1{5,}/.test(filename)) return false;
    
    // Must have at least one letter (not just numbers/underscores)
    if (!/[a-z]/.test(filename)) return false;
    
    // Should not be just generic words
    const generic = ['screenshot', 'image', 'photo', 'file', 'document'];
    if (generic.includes(filename)) return false;

    return true;
  }

  /**
   * Sanitize and ensure filename safety
   */
  private sanitize(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_') // Replace invalid chars with underscore
      .replace(/_+/g, '_') // Collapse multiple underscores
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .slice(0, this.MAX_FILENAME_LENGTH); // Enforce max length
  }
}

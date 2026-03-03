import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async classify(text: string): Promise<string> {
    const prompt = `
You are an AI classifier inside a desktop application.

Your job:
Classify the given text into ONLY ONE of the following categories:

- code
- error
- chat
- ui
- document
- other

Rules:
1. Output ONLY the category name.
2. Do NOT explain.
3. Do NOT include quotes.
4. Do NOT include punctuation.
5. Do NOT include extra words.
6. If unsure, return "other".

Examples:
Text: "TypeError: Cannot read property map"
Output: error

Text: "const user = await fetchUser()"
Output: code

Text: "Hey are you coming today?"
Output: chat

Text: "Login page with username and password"
Output: ui

Text: "Blockchain is a distributed ledger"
Output: document

Now classify this text:
"""${text}"""
`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    return data.response
      .trim()
      .toLowerCase()
      .replace(/[^a-z]/g, '');
  }
}

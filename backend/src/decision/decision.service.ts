import { Injectable } from '@nestjs/common';

export interface DecisionResult {
    category: string;
    confidence: number;
    source: 'rule' | 'ai' | 'hybrid';
  }
  
  @Injectable()
  export class DecisionService {
    decide(
      ruleCategory: string,
      aiCategory: string
    ): DecisionResult {
      if (ruleCategory === aiCategory) {
        return {
          category: aiCategory,
          confidence: 0.9,
          source: 'hybrid',
        };
      }
  
      if (aiCategory !== 'other') {
        return {
          category: aiCategory,
          confidence: 0.75,
          source: 'ai',
        };
      }
  
      return {
        category: ruleCategory,
        confidence: 0.6,
        source: 'rule',
      };
    }
  }
  
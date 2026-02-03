import { Controller, Post, Body } from '@nestjs/common';
import { ClassifierService } from '../classifier/classifier.service';
import { AiService } from '../ai/ai.service';
import { DecisionService } from '../decision/decision.service';

@Controller('preview')
export class PreviewController {
  constructor(
    private readonly classifierService: ClassifierService,
    private readonly aiService: AiService,
    private readonly decisionService: DecisionService
  ) {}

  @Post()
  async preview(@Body('text') text: string) {
    const rule = this.classifierService.classify(text);
    const ai = await this.aiService.classify(text);
    const decision = this.decisionService.decide(rule, ai);

    return {
      rule,
      ai,
      final: decision.category,
      confidence: decision.confidence,
      source: decision.source,
    };
  }
}

import { Module } from '@nestjs/common';
import { PreviewController } from './preview.controller';
import { ClassifierModule } from '../classifier/classifier.module';
import { AiModule } from '../ai/ai.module';
import { DecisionModule } from '../decision/decision.module';

@Module({
  imports: [ClassifierModule, AiModule, DecisionModule],
  controllers: [PreviewController],
})
export class PreviewModule {}

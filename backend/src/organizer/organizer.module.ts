import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [OrganizerService],
  exports: [OrganizerService],
})
export class OrganizerModule {}

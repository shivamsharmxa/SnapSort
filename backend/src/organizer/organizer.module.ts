import { Module } from '@nestjs/common';
import { OrganizerService } from './organizer.service';

@Module({
  providers: [OrganizerService],
  exports: [OrganizerService],
})
export class OrganizerModule {}

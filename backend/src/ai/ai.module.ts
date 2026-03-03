import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { FilenameService } from './filename.service';

@Module({
  providers: [AiService, FilenameService],
  exports: [AiService, FilenameService],
})
export class AiModule {}

import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly config: ConfigService) {}

  @Post('dry-run')
  setDryRun(@Body('enabled') enabled: boolean) {
    this.config.setDryRun(enabled);
    return { dryRun: enabled };
  }
}

import { Controller, Post, Body, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
  constructor(private readonly config: ConfigService) {}

  @Get('status')
  getStatus() {
    return {
      monitoring: this.config.isMonitoring(),
      dryRun: this.config.isDryRun(),
    };
  }

  @Post('monitoring')
  setMonitoring(@Body('enabled') enabled: boolean) {
    this.config.setMonitoring(enabled);
    return { monitoring: enabled };
  }

  @Post('dry-run')
  setDryRun(@Body('enabled') enabled: boolean) {
    this.config.setDryRun(enabled);
    return { dryRun: enabled };
  }
}

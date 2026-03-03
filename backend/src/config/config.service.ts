import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private dryRun = false;
  private monitoring = true; // Start enabled by default

  setDryRun(value: boolean) {
    this.dryRun = value;
  }

  isDryRun(): boolean {
    return this.dryRun;
  }

  setMonitoring(value: boolean) {
    this.monitoring = value;
  }

  isMonitoring(): boolean {
    return this.monitoring;
  }
}

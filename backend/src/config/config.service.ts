import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private dryRun = false;

  setDryRun(value: boolean) {
    this.dryRun = value;
  }

  isDryRun(): boolean {
    return this.dryRun;
  }
}

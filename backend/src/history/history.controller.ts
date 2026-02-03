import { Controller, Get, Post } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  getAll() {
    return this.historyService.read();
  }

  @Post('undo')
  undo() {
    const undone = this.historyService.undoLast();
    return { success: !!undone, undone };
  }
}

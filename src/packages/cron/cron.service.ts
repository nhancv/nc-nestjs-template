import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor() {
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async testOutput(): Promise<void> {
    console.log('Cron job');
  }
}

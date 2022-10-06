import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'notifications',
  })
  handleAutoCron() {
    this.logger.debug('Called every 30 seconds');
  }

  // Create dynamically new cron job
  _processing = false;
  private addCronJob(name: string, cronTime: string, logic: () => any): void {
    const job = new CronJob(cronTime, async () => {
      if (this._processing) return;
      this._processing = true;
      if (logic) {
        await logic();
      }
      this._processing = false;
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(`[${cronTime}]job ${name} added!`);
  }

  // Test logic
  _business = async (): Promise<void> => {
    console.log('Cron job');
  };

  // Start cron job
  startCronJobs(): void {
    // CronExpression.EVERY_5_SECONDS
    this.addCronJob(
      'test_cronjob',
      CronExpression.EVERY_5_SECONDS,
      this._business,
    );
  }
}

import {Injectable, Logger} from '@nestjs/common';
import {CronExpression, SchedulerRegistry} from '@nestjs/schedule';
import {CronJob} from "cron";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {
  }

  // Create dynamically new cron job
  private addCronJob(name: string, cronTime: string, logic: () => any): void {
    const job = new CronJob(cronTime, async () => {
      if(logic) {
        await logic();
      }
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `[${cronTime}]job ${name} added!`,
    );
  }

  // Start cron job
  startCronJobs(): void {
    // CronExpression.EVERY_5_SECONDS
    this.addCronJob('test_cronjob', CronExpression.EVERY_5_SECONDS, CronService.testOutput);
  }

  // Test logic
  private static async testOutput(): Promise<void> {
    console.log('Cron job');
  }
}

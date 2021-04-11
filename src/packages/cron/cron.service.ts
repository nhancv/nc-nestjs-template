import {Injectable, Logger} from '@nestjs/common';
import {Cron, CronExpression} from '@nestjs/schedule';
import {UsersService} from "../../collections/users/users.service";
import {AppService} from "../../app/app.service";
import {RealtimeService} from "../realtime/realtime.service";

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private appService: AppService,
    private usersService: UsersService,
    private realtimeService: RealtimeService,
  ) {
  }

  // Called every minutes
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron(CronExpression.EVERY_MINUTE)
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async testOutput(): Promise<void> {
    console.log('Cron job: EVERY_DAY_AT_MIDNIGHT');
  }
}

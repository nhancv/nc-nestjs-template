import {Module} from '@nestjs/common';
import {CronService} from "./cron.service";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule
  ],
  controllers: [],
  providers: [
    CronService
  ],
  exports: [
    CronService
  ]
})
export class CronModule {
}

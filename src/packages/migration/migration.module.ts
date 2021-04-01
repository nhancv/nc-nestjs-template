import {Module} from '@nestjs/common';
import {MigrationService} from "./migration.service";
import {AppConfigModule} from "../../collections/app-config/app-config.module";
import {MigrationService1_0_0} from "./migration.service.1_0_0";

@Module({
  imports: [
    AppConfigModule,
  ],
  providers: [
    MigrationService,
    MigrationService1_0_0,
  ],
  exports: [MigrationService]
})
export class MigrationModule {

}

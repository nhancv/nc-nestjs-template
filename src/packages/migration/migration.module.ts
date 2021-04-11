import {Module} from '@nestjs/common';
import {MigrationService} from "./migration.service";
import {AppConfigModule} from "../../collections/app-config/app-config.module";
import {MigrationService1_0_0} from "./migration.service.1_0_0";
import {AdminsModule} from "../../collections/admins/admins.module";
import {UsersModule} from "../../collections/users/users.module";

@Module({
  imports: [
    AppConfigModule,
    AdminsModule,
    UsersModule,
  ],
  providers: [
    MigrationService,
    MigrationService1_0_0,
  ],
  exports: [MigrationService]
})
export class MigrationModule {

}

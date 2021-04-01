import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AppConfigService} from "../../collections/app-config/app-config.service";
import {AppConfig} from "../../collections/app-config/schemas/app-config.schema";

@Injectable()
export class MigrationService1_0_0 {
  private readonly logger = new Logger(MigrationService1_0_0.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
  ) {
  }

  async migrate(appConfig: AppConfig): Promise<void> {
    this.logger.debug('migrate');
  }
}

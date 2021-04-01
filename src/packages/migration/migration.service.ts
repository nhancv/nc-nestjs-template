import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {AppConfigService} from "../../collections/app-config/app-config.service";
import {AppConfig} from "../../collections/app-config/schemas/app-config.schema";
import {MigrationService1_0_0} from "./migration.service.1_0_0";
import {Document} from "mongoose";

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly appConfigService: AppConfigService,
    private readonly migrateService1_0_0: MigrationService1_0_0,
  ) {
  }

  // Clone data from source to another connector
  async cloneDatabaseFromSource(): Promise<void> {
    const sourceConnection = '';
    const targetConnection = '';
    if (!sourceConnection || sourceConnection === '' ||
      !targetConnection || targetConnection === '') {
      console.log('sourceConnection or targetConnection is null');
      return;
    }
    const mongoose = require('mongoose');
    const mongooseOption = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    };
    const sourceMongoose = await mongoose.createConnection(sourceConnection, mongooseOption);
    const targetMongoose = await mongoose.createConnection(targetConnection, mongooseOption);
    const initTables: { name: string, schema: Document }[] = [];
    for (let i = 0; i < initTables.length; i++) {
      const table = initTables[i];
      console.log(`Import table "${table.name}"`);
      const sourceM = sourceMongoose.model(table.name, table.schema);
      const targetM = targetMongoose.model(table.name, table.schema);
      // Clear target
      const clearRes = await targetM.deleteMany({});
      console.log(`clear target: ${clearRes && clearRes.n > 0}`);
      // Import
      const allRow = await sourceM.find();
      let successCount = 0;
      for (let r = 0; r < allRow.length; r++) {
        const m = allRow[r].toObject();
        const res = await targetM.create(m);
        if (res) {
          successCount++;
        }
      }
      console.log(`imported, success ${successCount}/${allRow.length}`);
    }
    // Done
    console.log('DONE');
    return;
  }

  async migrate(): Promise<void> {
    // Init app config version
    const appConfig = await this.initAppConfigCollection();

    // Migrate
    if (appConfig) {
      const currentAppVersion = appConfig.version;

      let nextVersion: string;
      switch (currentAppVersion) {
        case '0.0.0' :
        // case '1.0.0' :
        //   await this.migrateService1_0_0.migrate(appConfig);
        default:
          nextVersion = '0.0.0';
          break;
      }
      // Update to next version
      if (nextVersion !== currentAppVersion) {
        this.logger.debug(`Current version: ${currentAppVersion} => ${nextVersion}`);
        await this.appConfigService.putAppConfig({
          ...appConfig.toObject(),
          version: nextVersion
        });
      }
    }
  }

  async initAppConfigCollection(): Promise<AppConfig | null> {
    let appConfig = await this.appConfigService.getAppConfig();
    // Init app config version
    if (!appConfig || !appConfig.version) {
      appConfig = await this.appConfigService.putAppConfig({
        version: '0.0.0',
        maintenance: false,
      });
    }

    return appConfig;
  }

}

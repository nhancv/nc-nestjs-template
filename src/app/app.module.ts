import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {AppLogModule} from "../collections/app-log/app-log.module";
import {AppConfigModule} from "../collections/app-config/app-config.module";
import {MigrationModule} from "../packages/migration/migration.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL ?? ''),
    ScheduleModule.forRoot(),
    MigrationModule,
    AppConfigModule,
    AppLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {AppLogModule} from "../collections/app-log/app-log.module";
import {AppConfigModule} from "../collections/app-config/app-config.module";
import {MigrationModule} from "../packages/migration/migration.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ScheduleModule} from "@nestjs/schedule";
import {InMemoryDBModule} from "@nestjs-addons/in-memory-db";
import {UsersModule} from "../collections/users/users.module";
import {AuthModule} from "../collections/auth/auth.module";
import {AdminsModule} from "../collections/admins/admins.module";
import {RealtimeModule} from "../packages/realtime/realtime.module";
import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
import {APP_GUARD} from "@nestjs/core";
import {CronModule} from "../packages/cron/cron.module";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL ?? '', {
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
    InMemoryDBModule.forRoot(),
    ScheduleModule.forRoot(),
    // https://docs.nestjs.com/security/rate-limiting
    // https://github.com/nestjs/throttler
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL', 60),
        limit: config.get('THROTTLE_LIMIT', 10000),
      }),
    }),
    MigrationModule,
    AppConfigModule,
    AppLogModule,
    AuthModule,
    AdminsModule,
    UsersModule,
    RealtimeModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
}

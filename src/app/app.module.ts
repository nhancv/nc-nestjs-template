import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from 'path';
import {ThrottlerModule} from "@nestjs/throttler";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api*'],
    }),
    // https://docs.nestjs.com/security/rate-limiting
    ThrottlerModule.forRoot({ttl: 60, limit: 20}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

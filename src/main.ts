import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as moment from 'moment';
import * as morgan from 'morgan';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { AllExceptionFilter } from './utils/all.exception.filter';

async function bootstrap() {
  const logger = new Logger('main');

  const ENABLE_WEB = (process.env.ENABLE_WEB ?? 'true') == 'true';
  const ENABLE_WORKER = (process.env.ENABLE_WORKER ?? 'false') == 'true';
  const ENABLE_HTTPS = (process.env.ENABLE_HTTPS ?? 'false') == 'true';

  // Check worker api
  if (ENABLE_WEB) {
    //----------------------------//
    //------Web Applications------//
    /*
    For nginx proxy forward
    => update nginx.conf
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $host;
     */

    // Create app instance for API mode
    const appOptions = {};
    if (ENABLE_HTTPS) {
      appOptions['httpsOptions'] = {
        key: fs.readFileSync('./ssl/localhost/server.key'),
        cert: fs.readFileSync('./ssl/localhost/server.crt'),
      };
    }
    const app = await NestFactory.create<NestExpressApplication>(AppModule, appOptions);
    app.set('trust proxy', 'loopback');
    morgan.token('date', () => moment().utc().utcOffset('+0700').format());
    const morganFormat = ':remote-addr - :remote-user [:date] :method :url :status - :response-time ms :user-agent';
    app.use(morgan(morganFormat));
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    // Enable Swagger api docs module
    const options = new DocumentBuilder()
      .setTitle('The API document')
      .setDescription('----------')
      .setVersion(process.env.npm_package_version ?? '')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);

    // Migrate first
    // ...

    // Start api
    const port = parseInt(process.env.PORT || '3000');
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: ${await app.getUrl()}`);

    // Full mode
    if (ENABLE_WORKER) {
      // Start cronjob
      // ...
    }
  } else if (ENABLE_WORKER) {
    //-----------------------------------//
    //------Standalone Applications------//
    // https://docs.nestjs.com/standalone-applications
    /*
    The Nest standalone application is a wrapper around the Nest IoC container, which holds all instantiated classes.
    We can obtain a reference to any existing instance from within any imported module directly using the standalone application object.
    Thus, you can take advantage of the Nest framework anywhere, including, for example, scripted CRON jobs.
     */

    // Create app instance for Standalone mode
    const app = await NestFactory.createApplicationContext(AppModule);
    // Application logic......
    // Get app service
    const appService = app.get(AppService);
    logger.log(appService.getHello());
    // Start cronjob
    // ...
  }
}

bootstrap().then();

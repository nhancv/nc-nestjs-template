import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const logger = new Logger(process.env.NODE_ENV);
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

bootstrap().then();

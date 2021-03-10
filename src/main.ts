import {NestFactory} from '@nestjs/core';
import {AppService} from "./app.service";
import {AppModule} from './app.module';
import {AllExceptionsFilter} from "./utils/all-exceptions.filter";
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  //------Standalone Applications------//
  // https://docs.nestjs.com/standalone-applications
  // Application logic......
  //
  // const appService = app.get(AppService);
  // logger.log(appService.getHello());

  //------Web Applications------//
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  // Enable Swagger api docs module
  const options = new DocumentBuilder()
    .setTitle('Default example')
    .setDescription('The default API description')
    .setVersion(process.env.npm_package_version ?? '')
    .addTag('default')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().then();

import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from "./utils/all-exceptions.filter";
import {Logger, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
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

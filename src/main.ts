import {NestFactory} from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {AppModule} from './app.module';
import {AllExceptionsFilter} from "./utils/all-exceptions.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Enable Swagger api docs module
  const options = new DocumentBuilder()
  .setTitle('Default example')
  .setDescription('The default API description')
  .setVersion(process.env.npm_package_version ?? '')
  .addTag('default')
  .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().then();

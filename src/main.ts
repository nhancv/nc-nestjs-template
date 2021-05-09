import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {AllExceptionFilter} from "./utils/all.exception.filter";
import {Logger, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import morgan from 'morgan';
import moment from 'moment';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // //------Standalone Applications------//
  // // https://docs.nestjs.com/standalone-applications
  // // Application logic......
  // const appService = app.get(AppService);
  // logger.log(appService.getHello());

  //------Web Applications------//
  // For nginx proxy forward
  // => update nginx.conf
  // proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  // proxy_set_header X-Real-IP $remote_addr;
  // proxy_set_header Host $host;
  app.set('trust proxy', 'loopback');
  morgan.token('date', (req, res, tz) => moment().utc().utcOffset("+0700").format());
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

  const port = parseInt(process.env.PORT || '3000');
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().then();

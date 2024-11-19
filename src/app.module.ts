import { join } from 'path';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PrometheusModule } from './modules/prometheus/prometheus.module';
import { PrometheusMiddleware } from './modules/prometheus/prometheus.middleware';
import { PrometheusController } from './modules/prometheus/prometheus.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
        PORT: Joi.number().default(3000),
        ENABLE_HTTPS: Joi.bool().default(false),
        ENABLE_WEB: Joi.bool().default(true),
        ENABLE_WORKER: Joi.bool().default(true),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),
    // https://docs.nestjs.com/security/rate-limiting
    // https://github.com/nestjs/throttler
    // The above will set the global options for the ttl (the time to live in seconds),
    // and the limit (the maximum number of requests within the ttl).
    // for the routes of your application that are guarded.
    // Example: no more than 30 calls in 1 second
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL', 1),
        limit: config.get('THROTTLE_LIMIT', 30),
      }),
    }),
    PrometheusModule,
  ],
  controllers: [AppController, PrometheusController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PrometheusMiddleware).exclude({ path: '/api/metrics', method: RequestMethod.ALL }).forRoutes('*');
  }
}

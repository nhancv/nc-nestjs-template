import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { PrometheusModule } from './prometheus.module';

@Injectable()
export class PrometheusMiddleware implements NestMiddleware {
  constructor(private readonly prometheusModule: PrometheusModule) {}

  use(req: Request, res: Response, next: NextFunction) {
    const counter = this.prometheusModule.getHttpRequestCounter();
    const histogram = this.prometheusModule.getHttpRequestDuration();

    const end = histogram.startTimer({
      method: req.method,
      route: req.originalUrl,
    });

    res.on('finish', () => {
      counter.inc({
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode,
      });
      end({ status: res.statusCode });
    });

    next();
  }
}

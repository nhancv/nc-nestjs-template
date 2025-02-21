import { Controller, Get, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';

import { PrometheusModule } from './prometheus.module';

@Controller('metrics')
export class PrometheusController {
  constructor(private readonly prometheusModule: PrometheusModule) {}

  @Throttle({ default: { limit: 3, ttl: 1_000 } })
  @Get()
  async getMetrics(@Res() res: Response) {
    const metrics = await this.prometheusModule.getRegistry().metrics();
    res.setHeader('Content-Type', this.prometheusModule.getRegistry().contentType);
    res.send(metrics);
  }
}

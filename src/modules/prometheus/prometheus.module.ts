import { Counter, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

import { Module } from '@nestjs/common';

@Module({
  providers: [PrometheusModule],
  exports: [PrometheusModule],
})
export class PrometheusModule {
  private readonly registry = new Registry();

  private readonly httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  });

  private readonly httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
  });

  constructor() {
    collectDefaultMetrics({ register: this.registry });
    this.registry.registerMetric(this.httpRequestCounter);
    this.registry.registerMetric(this.httpRequestDuration);
  }

  getRegistry() {
    return this.registry;
  }

  getHttpRequestCounter() {
    return this.httpRequestCounter;
  }

  getHttpRequestDuration() {
    return this.httpRequestDuration;
  }
}

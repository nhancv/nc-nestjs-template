import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { BaseResponse } from '@utils/base.response';

import { AppService } from './app.service';

@ApiTags('app')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Override default configuration for Rate limiting and duration.
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  @Get()
  @ApiOkResponse({
    description: 'Test app works',
    type: String,
  })
  @ApiOperation({ summary: 'hello' })
  @Version(VERSION_NEUTRAL)
  // @Version(['1', '2'])
  getHello(): BaseResponse<string> {
    return {
      data: this.appService.getHello(),
    };
  }
}

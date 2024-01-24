import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './utils/base.response';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('app')
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle(2, 1)
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

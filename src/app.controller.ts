import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BaseResponse } from './utils/base.response';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle(3, 60)
  @Get()
  @ApiOkResponse({
    description: 'Test app works',
    type: String,
  })
  @ApiOperation({ summary: 'hello' })
  getHello(): BaseResponse<string> {
    const response: BaseResponse<string> = {};
    response.data = this.appService.getHello();
    return response;
  }
}

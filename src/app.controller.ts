import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {BaseResponse} from "./responses/base.response";
import {ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  @ApiOkResponse({
    description: 'Test app works',
    type: String,
  })
  @ApiOperation({summary: 'hello'})
  getHello(): BaseResponse<string> {
    const response: BaseResponse<string> = {}
    response.data = this.appService.getHello();
    return response;
  }
}

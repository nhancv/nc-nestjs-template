import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {BaseResponse} from "./responses/base.response";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): BaseResponse<string> {
    const response: BaseResponse<string> = {}
    response.data = this.appService.getHello();
    return response;
  }
}

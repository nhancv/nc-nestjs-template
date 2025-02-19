import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { AppException } from './app.exception';
import { BaseResponse } from './base.response';

// https://docs.nestjs.com/exception-filters
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Internal server error';
    if (exception instanceof BadRequestException) {
      const exceptionRes = exception.getResponse();
      if (exceptionRes.hasOwnProperty('message')) {
        errorMessage = JSON.stringify(exceptionRes['message']);
      } else {
        errorMessage = JSON.stringify(exceptionRes);
      }
    } else if (exception instanceof Object && exception.hasOwnProperty('message')) {
      errorMessage = exception['message'];
    }

    const error: BaseResponse<any> = {
      error: {
        code: status,
        message: errorMessage,
      },
    };
    this.logger.error(JSON.stringify(new AppException('catch:46', error)));
    response.status(status).json(error);
  }
}

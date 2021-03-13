import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {BaseResponse} from "../models/responses/base.response";
import {AppException} from "./app-exception";

// https://docs.nestjs.com/exception-filters
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage: string = 'Internal server error';
    if (exception instanceof BadRequestException) {
      const exceptionRes = exception.getResponse();
      if (exceptionRes.hasOwnProperty('message')) {
        errorMessage = JSON.stringify(exceptionRes['message'])
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
      }
    }
    this.logger.error(new AppException('catch:46', error));
    response.status(status).json(error);
  }
}

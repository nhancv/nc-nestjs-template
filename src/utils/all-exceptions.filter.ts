import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,} from '@nestjs/common';
import {BaseResponse} from "../entities/base.response";

// https://docs.nestjs.com/exception-filters
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        console.log(exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        
        const error: BaseResponse<any> = {
            error: {
                code: status,
                message: (exception instanceof Object && exception.hasOwnProperty('message'))
                    ? exception['message'] : 'Internal server error'
            }
        }
        response.status(status).json(error);
    }
}

import {ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus,} from '@nestjs/common';
import {BaseResponse} from "../responses/base.response";

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
        
        let errorMessage = 'Internal server error';
        if (exception instanceof BadRequestException) {
            const exceptionRes = exception.getResponse();
            if(exceptionRes instanceof Object && exceptionRes.hasOwnProperty('message')) {
                errorMessage = JSON.stringify(exceptionRes['message'])
            } else {
                errorMessage = JSON.stringify(exceptionRes);
            }
        } else if(exception instanceof Object && exception.hasOwnProperty('message')) {
            errorMessage = exception['message'];
        }
        
        const error: BaseResponse<any> = {
            error: {
                code: status,
                message: errorMessage,
            }
        }
        response.status(status).json(error);
    }
}

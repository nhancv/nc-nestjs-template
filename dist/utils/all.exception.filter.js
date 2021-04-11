"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const app_exception_1 = require("./app.exception");
let AllExceptionFilter = AllExceptionFilter_1 = class AllExceptionFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';
        if (exception instanceof common_1.BadRequestException) {
            const exceptionRes = exception.getResponse();
            if (exceptionRes.hasOwnProperty('message')) {
                errorMessage = JSON.stringify(exceptionRes['message']);
            }
            else {
                errorMessage = JSON.stringify(exceptionRes);
            }
        }
        else if (exception instanceof Object && exception.hasOwnProperty('message')) {
            errorMessage = exception['message'];
        }
        const error = {
            error: {
                code: status,
                message: errorMessage,
            }
        };
        this.logger.error(JSON.stringify(new app_exception_1.AppException('catch:46', error)));
        response.status(status).json(error);
    }
};
AllExceptionFilter = AllExceptionFilter_1 = __decorate([
    common_1.Catch()
], AllExceptionFilter);
exports.AllExceptionFilter = AllExceptionFilter;
//# sourceMappingURL=all.exception.filter.js.map
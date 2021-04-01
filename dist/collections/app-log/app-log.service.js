"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const app_log_schema_1 = require("./schemas/app-log.schema");
let AppLogService = class AppLogService {
    constructor(connection, appLogModel) {
        this.connection = connection;
        this.appLogModel = appLogModel;
    }
    async findAppLogs(type) {
        return await this.appLogModel.find({ type: type }, { '__v': 0 }).exec();
    }
    async findAppLogsByFilter(filter) {
        return await this.appLogModel.find(filter, { '__v': 0 }).exec();
    }
    async createAppLog(createAppLogDto) {
        const appLogModel = new this.appLogModel(createAppLogDto);
        return await appLogModel.save();
    }
};
AppLogService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectConnection()),
    __param(1, mongoose_1.InjectModel(app_log_schema_1.AppLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        mongoose_2.Model])
], AppLogService);
exports.AppLogService = AppLogService;
//# sourceMappingURL=app-log.service.js.map
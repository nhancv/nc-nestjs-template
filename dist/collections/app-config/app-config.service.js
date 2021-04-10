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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AppConfigService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const app_config_schema_1 = require("./schemas/app-config.schema");
const moment_1 = __importDefault(require("moment"));
let AppConfigService = AppConfigService_1 = class AppConfigService {
    constructor(connection, appConfigModel) {
        this.connection = connection;
        this.appConfigModel = appConfigModel;
        this.logger = new common_1.Logger(AppConfigService_1.name);
    }
    async getAppConfig() {
        return this.appConfigModel.findOne().exec();
    }
    async putAppConfig(appConfigDto) {
        await this.appConfigModel.updateOne({}, Object.assign(Object.assign({}, appConfigDto), { updatedAt: moment_1.default().toDate() }), { upsert: true });
        return this.getAppConfig();
    }
};
AppConfigService = AppConfigService_1 = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectConnection()),
    __param(1, mongoose_1.InjectModel(app_config_schema_1.AppConfig.name)),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        mongoose_2.Model])
], AppConfigService);
exports.AppConfigService = AppConfigService;
//# sourceMappingURL=app-config.service.js.map
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
var MigrationService1_0_0_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService1_0_0 = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_service_1 = require("../../collections/app-config/app-config.service");
let MigrationService1_0_0 = MigrationService1_0_0_1 = class MigrationService1_0_0 {
    constructor(configService, appConfigService) {
        this.configService = configService;
        this.appConfigService = appConfigService;
        this.logger = new common_1.Logger(MigrationService1_0_0_1.name);
    }
    async migrate(appConfig) {
        this.logger.debug('migrate');
    }
};
MigrationService1_0_0 = MigrationService1_0_0_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        app_config_service_1.AppConfigService])
], MigrationService1_0_0);
exports.MigrationService1_0_0 = MigrationService1_0_0;
//# sourceMappingURL=migration.service.1_0_0.js.map
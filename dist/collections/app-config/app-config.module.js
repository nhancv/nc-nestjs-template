"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigModule = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("./app-config.service");
const mongoose_1 = require("@nestjs/mongoose");
const app_config_schema_1 = require("./schemas/app-config.schema");
let AppConfigModule = class AppConfigModule {
};
AppConfigModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: app_config_schema_1.AppConfig.name, schema: app_config_schema_1.AppConfigSchema },
            ])
        ],
        providers: [app_config_service_1.AppConfigService],
        exports: [app_config_service_1.AppConfigService],
    })
], AppConfigModule);
exports.AppConfigModule = AppConfigModule;
//# sourceMappingURL=app-config.module.js.map
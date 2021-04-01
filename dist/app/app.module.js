"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const app_log_module_1 = require("../collections/app-log/app-log.module");
const app_config_module_1 = require("../collections/app-config/app-config.module");
const migration_module_1 = require("../packages/migration/migration.module");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path_1.join(__dirname, '..', '..', 'public'),
                exclude: ['/api*'],
            }),
            mongoose_1.MongooseModule.forRoot((_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : ''),
            schedule_1.ScheduleModule.forRoot(),
            migration_module_1.MigrationModule,
            app_config_module_1.AppConfigModule,
            app_log_module_1.AppLogModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
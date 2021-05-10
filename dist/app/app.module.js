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
const in_memory_db_1 = require("@nestjs-addons/in-memory-db");
const users_module_1 = require("../collections/users/users.module");
const auth_module_1 = require("../collections/auth/auth.module");
const admins_module_1 = require("../collections/admins/admins.module");
const realtime_module_1 = require("../packages/realtime/realtime.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const cron_module_1 = require("../packages/cron/cron.module");
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
            mongoose_1.MongooseModule.forRoot((_a = process.env.MONGODB_URL) !== null && _a !== void 0 ? _a : '', {
                useNewUrlParser: true,
                useCreateIndex: true,
            }),
            in_memory_db_1.InMemoryDBModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    ttl: config.get('THROTTLE_TTL', 60),
                    limit: config.get('THROTTLE_LIMIT', 10),
                }),
            }),
            migration_module_1.MigrationModule,
            app_config_module_1.AppConfigModule,
            app_log_module_1.AppLogModule,
            auth_module_1.AuthModule,
            admins_module_1.AdminsModule,
            users_module_1.UsersModule,
            realtime_module_1.RealtimeModule,
            cron_module_1.CronModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map
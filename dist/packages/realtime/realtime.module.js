"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeModule = void 0;
const common_1 = require("@nestjs/common");
const realtime_gateway_1 = require("./realtime.gateway");
const auth_module_1 = require("../../collections/auth/auth.module");
const realtime_service_1 = require("./realtime.service");
const in_memory_db_1 = require("@nestjs-addons/in-memory-db");
const realtime_controller_1 = require("./realtime.controller");
const users_module_1 = require("../../collections/users/users.module");
let RealtimeModule = class RealtimeModule {
};
RealtimeModule = __decorate([
    common_1.Module({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            in_memory_db_1.InMemoryDBModule.forFeature('user', {}),
        ],
        providers: [realtime_gateway_1.RealtimeGateway, realtime_service_1.RealtimeService],
        controllers: [realtime_controller_1.RealtimeController],
        exports: [realtime_service_1.RealtimeService],
    })
], RealtimeModule);
exports.RealtimeModule = RealtimeModule;
//# sourceMappingURL=realtime.module.js.map
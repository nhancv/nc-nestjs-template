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
var RealtimeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeService = exports.UNAUTHORIZED_EVENT = exports.OFFLINE_EVENT = exports.ONLINE_EVENT = exports.MESSAGE_EVENT = void 0;
const common_1 = require("@nestjs/common");
const in_memory_db_1 = require("@nestjs-addons/in-memory-db");
exports.MESSAGE_EVENT = 'message-event';
exports.ONLINE_EVENT = 'online-event';
exports.OFFLINE_EVENT = 'offline-event';
exports.UNAUTHORIZED_EVENT = 'unauthorized-event';
let RealtimeService = RealtimeService_1 = class RealtimeService {
    constructor(wsUserService) {
        this.wsUserService = wsUserService;
        this.logger = new common_1.Logger(RealtimeService_1.name);
    }
    storeUser(connection) {
        const newUser = {
            connection: connection,
            userId: connection.conn.userId,
            socketId: connection.conn.id,
            timestamp: Date.now()
        };
        return this.wsUserService.create(newUser);
    }
    removeUser(memoryId) {
        this.wsUserService.delete(memoryId);
    }
    getUser(userId) {
        const wsUsers = this.wsUserService.getAll();
        for (let i = 0; i < wsUsers.length; i++) {
            if (wsUsers[i].userId === userId) {
                return wsUsers[i];
            }
        }
        return null;
    }
    getOtherUsers(userId) {
        const wsUsers = this.wsUserService.getAll();
        const res = [];
        for (let i = 0; i < wsUsers.length; i++) {
            if (wsUsers[i].userId !== userId) {
                res.push(wsUsers[i]);
            }
        }
        return res;
    }
    isOnline(userId) {
        const wsUsers = this.wsUserService.getAll();
        for (let i = 0; i < wsUsers.length; i++) {
            if (wsUsers[i].userId === userId) {
                return true;
            }
        }
        return false;
    }
    filterOnlineInList(userIds) {
        const onlineList = {};
        const wsUsers = this.wsUserService.getAll();
        for (let i = 0; i < wsUsers.length; i++) {
            const onlineUid = wsUsers[i].userId;
            if (userIds.indexOf(onlineUid) > -1) {
                onlineList[onlineUid] = true;
            }
        }
        return Object.keys(onlineList);
    }
};
RealtimeService = RealtimeService_1 = __decorate([
    common_1.Injectable(),
    __param(0, in_memory_db_1.InjectInMemoryDBService('user')),
    __metadata("design:paramtypes", [in_memory_db_1.InMemoryDBService])
], RealtimeService);
exports.RealtimeService = RealtimeService;
//# sourceMappingURL=realtime.service.js.map
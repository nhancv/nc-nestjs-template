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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_auth_guard_1 = require("./socket-auth.guard");
const auth_service_1 = require("../../collections/auth/auth.service");
const realtime_service_1 = require("./realtime.service");
const users_service_1 = require("../../collections/users/users.service");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor(usersService, authService, realtimeService) {
        this.usersService = usersService;
        this.authService = authService;
        this.realtimeService = realtimeService;
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
    }
    afterInit(server) {
        this.logger.log(`Init socket server ${server.path()}`);
    }
    async handleDisconnect(client) {
        const userId = client.conn.userId;
        this.logger.warn(`Disconnected [uid: ${userId} - wsid: ${client.conn.id}]`);
        const otherUsers = this.realtimeService.getOtherUsers(userId);
        for (let i = 0; i < otherUsers.length; i++) {
            otherUsers[i].connection.emit(realtime_service_1.OFFLINE_EVENT, {
                user_id: userId
            });
        }
        this.realtimeService.removeUser(client.conn.memoryId);
    }
    async handleConnection(client, ...args) {
        const authorized = await socket_auth_guard_1.SocketAuthGuard.verifyToken(this.authService, this.realtimeService, client, client.handshake.headers.authorization);
        if (!authorized) {
            this.logger.error(`[${client.id}] Socket UnauthorizedException`);
            client.emit(realtime_service_1.UNAUTHORIZED_EVENT, 'Unauthorized');
            client.disconnect(true);
            return;
        }
        const userId = client.conn.userId;
        this.logger.log(`Connected [uid: ${userId} - wsid: ${client.conn.id}]`);
        const otherUsers = this.realtimeService.getOtherUsers(userId);
        for (let i = 0; i < otherUsers.length; i++) {
            otherUsers[i].connection.emit(realtime_service_1.ONLINE_EVENT, {
                user_id: userId
            });
        }
    }
    async onMessageEvent(client, data) {
        const userId = client.conn.userId;
        const otherUsers = this.realtimeService.getOtherUsers(userId);
        for (let i = 0; i < otherUsers.length; i++) {
            otherUsers[i].connection.emit(realtime_service_1.MESSAGE_EVENT, {
                from_id: userId,
                data: data
            });
        }
        return 0;
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", Object)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    websockets_1.SubscribeMessage(realtime_service_1.MESSAGE_EVENT),
    __param(0, websockets_1.ConnectedSocket()), __param(1, websockets_1.MessageBody()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "onMessageEvent", null);
RealtimeGateway = RealtimeGateway_1 = __decorate([
    common_1.UsePipes(new common_1.ValidationPipe()),
    common_1.UseInterceptors(common_1.ClassSerializerInterceptor),
    common_1.UseGuards(socket_auth_guard_1.SocketAuthGuard),
    websockets_1.WebSocketGateway({
        transports: ['polling', 'websocket'],
        handlePreflightRequest: (req, res) => {
            const headers = {
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Origin': req.headers.origin,
                'Access-Control-Allow-Credentials': true
            };
            res.writeHead(200, headers);
            res.end();
        }
    }),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService,
        realtime_service_1.RealtimeService])
], RealtimeGateway);
exports.RealtimeGateway = RealtimeGateway;
//# sourceMappingURL=realtime.gateway.js.map
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
var SocketAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../collections/auth/auth.service");
const realtime_service_1 = require("./realtime.service");
let SocketAuthGuard = SocketAuthGuard_1 = class SocketAuthGuard {
    constructor(authService, realtimeService) {
        this.authService = authService;
        this.realtimeService = realtimeService;
    }
    static async verifyToken(authService, realtimeService, socket, token) {
        let verify = false;
        try {
            const payload = socket.conn.payload;
            verify = !!(await authService.verifyAsync(socket.conn.jwtToken) &&
                !!(await authService.validateUser(payload)));
        }
        catch (e) {
        }
        if (socket.conn.userId && verify) {
            return true;
        }
        if (!token)
            return false;
        const isBearerToken = token.indexOf('Bearer ') === 0;
        const jwtToken = token.replace('Bearer ', '');
        const rawPayload = isBearerToken ? await authService.decodeJwt(jwtToken) : null;
        if (!rawPayload)
            return false;
        const payload = {
            uid: rawPayload['uid'],
            tid: rawPayload['tid'],
        };
        socket.conn.jwtToken = jwtToken;
        socket.conn.payload = payload;
        socket.conn.userId = payload.uid;
        verify = false;
        try {
            verify = !!(await authService.verifyAsync(socket.conn.jwtToken) &&
                await authService.validateUser(payload));
        }
        catch (e) {
        }
        if (verify) {
            const user = realtimeService.storeUser(socket);
            socket.conn.memoryId = user.id;
            return true;
        }
        return false;
    }
    async canActivate(context) {
        var _a;
        const client = (_a = context === null || context === void 0 ? void 0 : context.switchToWs()) === null || _a === void 0 ? void 0 : _a.getClient();
        return SocketAuthGuard_1.verifyToken(this.authService, this.realtimeService, client, client.conn.token);
    }
};
SocketAuthGuard = SocketAuthGuard_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        realtime_service_1.RealtimeService])
], SocketAuthGuard);
exports.SocketAuthGuard = SocketAuthGuard;
//# sourceMappingURL=socket-auth.guard.js.map
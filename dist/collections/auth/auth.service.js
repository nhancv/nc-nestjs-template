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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const admins_service_1 = require("../admins/admins.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const auth_token_schema_1 = require("./schemas/auth-token.schema");
const app_util_1 = require("../../utils/app.util");
let AuthService = class AuthService {
    constructor(connection, accessTokenModel, jwtService, adminsService, usersService) {
        this.connection = connection;
        this.accessTokenModel = accessTokenModel;
        this.jwtService = jwtService;
        this.adminsService = adminsService;
        this.usersService = usersService;
    }
    async login(loginDto) {
        var _a;
        const user = await this.usersService.getUserByUsernameRaw(loginDto.username);
        const loginPassword = loginDto.password;
        const userPassword = user === null || user === void 0 ? void 0 : user.password;
        if (user && userPassword && await app_util_1.AppUtil.hashVerify(loginPassword, userPassword)) {
            const tokenDuration = (_a = process.env.EXPIRES_IN) !== null && _a !== void 0 ? _a : '-';
            const tid = app_util_1.AppUtil.nanoId();
            const uid = user.uid;
            const payload = { uid: uid, tid: tid };
            const accessToken = this.jwtService.sign(payload);
            await this.createAuthToken({
                tid: tid,
                uid: uid,
                accessToken: accessToken,
                duration: tokenDuration,
            });
            const obj = user.toObject();
            delete obj._id;
            delete obj.__v;
            delete obj.password;
            return {
                user: obj,
                accessToken: accessToken,
                expiresIn: tokenDuration,
            };
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
    async getAuthTokenByTid(tid) {
        return await this.accessTokenModel.findOne({ tid: tid }, { '_id': 0, '__v': 0 }).exec();
    }
    async getAuthTokensByUid(uid) {
        return await this.accessTokenModel.find({ uid: uid }, { '_id': 0, '__v': 0 }).exec();
    }
    async getAuthTokenByAccessToken(accessToken) {
        return await this.accessTokenModel.findOne({ accessToken: accessToken }, { '_id': 0, '__v': 0 }).exec();
    }
    async deleteAuthToken(tid) {
        const res = await this.accessTokenModel.deleteOne({ tid: tid }).exec();
        return (res && res.deletedCount ? res.deletedCount > 0 : false);
    }
    async deleteAuthTokens(uid) {
        const res = await this.accessTokenModel.deleteMany({ uid: uid }).exec();
        return (res && res.deletedCount ? res.deletedCount > 0 : false);
    }
    async createAuthToken(createAuthTokenDto) {
        const accessToken = createAuthTokenDto.accessToken;
        const userModel = new this.accessTokenModel(createAuthTokenDto);
        const user = await userModel.save();
        if (user) {
            return this.getAuthTokenByAccessToken(accessToken);
        }
        return null;
    }
    async validateUser(payload) {
        const uid = payload.uid;
        const tid = payload.tid;
        const authToken = await this.getAuthTokenByTid(tid);
        if (!authToken) {
            return null;
        }
        const user = await this.usersService.getUserByUid(uid);
        if (!user) {
            return null;
        }
        else {
            const userWRole = user.toObject();
            const admin = await this.adminsService.getAdmin(uid);
            if (admin && admin.role) {
                userWRole.role = admin.role;
            }
            return userWRole;
        }
    }
    async verifyAsync(jwtToken) {
        return this.jwtService.verifyAsync(jwtToken);
    }
    decodeJwt(jwtToken) {
        return this.jwtService.decode(jwtToken);
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectConnection()),
    __param(1, mongoose_1.InjectModel(auth_token_schema_1.AuthToken.name)),
    __metadata("design:paramtypes", [mongoose_2.Connection,
        mongoose_2.Model,
        jwt_1.JwtService,
        admins_service_1.AdminsService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
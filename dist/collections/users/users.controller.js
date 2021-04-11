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
var UsersController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_response_1 = require("../../utils/base.response");
const auth_decorator_1 = require("../auth/auth.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const user_schema_1 = require("./schemas/user.schema");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
const api_implicit_query_decorator_1 = require("@nestjs/swagger/dist/decorators/api-implicit-query.decorator");
const create_user_dto_1 = require("./dto/create-user.dto");
const auth_service_1 = require("../auth/auth.service");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
        this.logger = new common_1.Logger(UsersController_1.name);
    }
    async getUsers(input, from, to, payload) {
        const response = {};
        response.data = await this.usersService.getUsers(input, from, to);
        return response;
    }
    async getMe(payload) {
        const response = {};
        response.data = await this.usersService.getUserByUid(payload.uid);
        return response;
    }
    async getUserInfo(uid, payload) {
        const response = {};
        response.data = await this.usersService.getUserByUid(uid);
        return response;
    }
    async createUser(user) {
        const response = {};
        if (user.username) {
            const exist = (await this.usersService.getUsers(user.username)).length > 0;
            if (!exist) {
                response.data = await this.usersService.createUser(user);
            }
            else {
                response.error = {
                    code: common_1.HttpStatus.NOT_ACCEPTABLE,
                    message: "User exist."
                };
            }
        }
        else {
            response.error = {
                code: common_1.HttpStatus.NOT_ACCEPTABLE,
                message: "username is empty"
            };
        }
        return response;
    }
    async updateMe(userDto, payload) {
        const response = {};
        const uid = payload.uid;
        const userByUsername = await this.usersService.getUserByUid(uid);
        if (!userByUsername || userByUsername.uid === uid) {
            const user = await this.usersService.updateUser(uid, userDto);
            if (user && userDto.password) {
                await this.authService.deleteAuthTokens(uid);
            }
            response.data = user;
        }
        else {
            response.error = {
                code: common_1.HttpStatus.NOT_ACCEPTABLE,
                message: "username is not available."
            };
        }
        return response;
    }
    async deleteUser(payload) {
        const response = {};
        response.data = await this.usersService.deleteUser(payload.uid);
        return response;
    }
};
__decorate([
    swagger_1.ApiOkResponse({
        description: 'List of user',
        type: [user_schema_1.User],
    }),
    api_implicit_query_decorator_1.ApiImplicitQuery({ name: 'input', required: false }),
    api_implicit_query_decorator_1.ApiImplicitQuery({ name: 'from', required: false }),
    api_implicit_query_decorator_1.ApiImplicitQuery({ name: 'to', required: false }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Search by username. Leave empty to get all.' }),
    common_1.Get('search'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Query('input')),
    __param(1, common_1.Query('from')),
    __param(2, common_1.Query('to')),
    __param(3, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsers", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'User info',
        type: user_schema_1.User,
    }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get me' }),
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMe", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'Get user info',
        type: user_schema_1.User,
    }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get user info' }),
    common_1.Get(':uid'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Param('uid')), __param(1, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserInfo", null);
__decorate([
    swagger_1.ApiCreatedResponse({
        description: 'User info',
        type: user_schema_1.User,
    }),
    swagger_1.ApiNotAcceptableResponse({
        description: 'User exist.',
        type: base_response_1.ErrorResponseType,
    }),
    swagger_1.ApiInternalServerErrorResponse({
        description: 'Internal Server Error',
        type: base_response_1.ErrorResponseType,
    }),
    swagger_1.ApiBody({ type: create_user_dto_1.CreateUserDto }),
    swagger_1.ApiOperation({ summary: 'Create user' }),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'User info',
        type: user_schema_1.User,
    }),
    swagger_1.ApiBody({ type: update_user_dto_1.UpdateUserDto }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update me' }),
    common_1.Put(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, common_1.Body()), __param(1, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMe", null);
__decorate([
    swagger_1.ApiOperation({ summary: 'Delete user' }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOkResponse({
        description: 'true or false',
        type: Boolean,
    }),
    common_1.Delete(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
UsersController = UsersController_1 = __decorate([
    swagger_1.ApiTags('users'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map
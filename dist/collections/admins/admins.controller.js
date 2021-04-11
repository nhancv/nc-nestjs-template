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
var AdminsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admins_service_1 = require("./admins.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const admin_schema_1 = require("./schemas/admin.schema");
const auth_decorator_1 = require("../auth/auth.decorator");
const roles_guard_1 = require("../auth/roles.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const admin_roles_1 = require("./dto/admin.roles");
const admin_dto_1 = require("./dto/admin.dto");
let AdminsController = AdminsController_1 = class AdminsController {
    constructor(adminsService) {
        this.adminsService = adminsService;
        this.logger = new common_1.Logger(AdminsController_1.name);
    }
    async getAdmin(payload) {
        const response = {};
        const uid = payload.uid;
        const admin = await this.adminsService.getAdmin(uid);
        if (!admin) {
            response.error = {
                code: common_1.HttpStatus.NOT_FOUND,
                message: "Admin was not found."
            };
        }
        else {
            response.data = admin;
        }
        return response;
    }
    async getAllAdmins(payload) {
        const response = {};
        response.data = await this.adminsService.getAdmins();
        return response;
    }
    async createAdmin(adminDto, payload) {
        const response = {};
        response.data = await this.adminsService.createAdmin(adminDto);
        return response;
    }
    async updateAdmin(adminDto, payload) {
        const response = {};
        response.data = await this.adminsService.updateAdmin(adminDto);
        return response;
    }
    async deleteAdmin(adminId, payload) {
        const response = {};
        response.data = await this.adminsService.deleteAdmin(adminId);
        return response;
    }
};
__decorate([
    swagger_1.ApiOkResponse({
        description: 'Admin info',
        type: admin_schema_1.Admin,
    }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get admin info' }),
    common_1.Get(),
    roles_decorator_1.Roles(admin_roles_1.ROLE_OWNER, admin_roles_1.ROLE_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAdmin", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'Admin list',
        type: [admin_schema_1.Admin],
    }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Get all admins' }),
    common_1.Get('all'),
    roles_decorator_1.Roles(admin_roles_1.ROLE_OWNER, admin_roles_1.ROLE_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "getAllAdmins", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'Admin info',
        type: admin_schema_1.Admin,
    }),
    swagger_1.ApiBody({ type: admin_dto_1.AdminDto }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Create new admin' }),
    common_1.Post(),
    roles_decorator_1.Roles(admin_roles_1.ROLE_OWNER, admin_roles_1.ROLE_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, common_1.Body()), __param(1, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "createAdmin", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'admin info',
        type: admin_schema_1.Admin,
    }),
    swagger_1.ApiBody({ type: admin_dto_1.AdminDto }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Update admin' }),
    common_1.Put(),
    roles_decorator_1.Roles(admin_roles_1.ROLE_OWNER, admin_roles_1.ROLE_ADMIN),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, common_1.Body()), __param(1, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "updateAdmin", null);
__decorate([
    swagger_1.ApiOkResponse({
        description: 'true/false',
        type: Boolean,
    }),
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiOperation({ summary: 'Delete admin - owner only' }),
    common_1.Delete(':uid'),
    roles_decorator_1.Roles(admin_roles_1.ROLE_OWNER),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, common_1.Param('uid')), __param(1, auth_decorator_1.AuthJwt()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminsController.prototype, "deleteAdmin", null);
AdminsController = AdminsController_1 = __decorate([
    swagger_1.ApiTags('admins'),
    common_1.Controller('admins'),
    __metadata("design:paramtypes", [admins_service_1.AdminsService])
], AdminsController);
exports.AdminsController = AdminsController;
//# sourceMappingURL=admins.controller.js.map
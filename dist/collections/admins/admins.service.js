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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const admin_schema_1 = require("./schemas/admin.schema");
const moment_1 = __importDefault(require("moment"));
let AdminsService = class AdminsService {
    constructor(connection, adminModel) {
        this.connection = connection;
        this.adminModel = adminModel;
    }
    async isEmpty() {
        return (await this.adminModel.estimatedDocumentCount().exec()) == 0;
    }
    async getAdmin(uid) {
        return await this.adminModel.findOne({ uid: uid }, { '_id': 0, '__v': 0 }).exec();
    }
    async getAdmins() {
        return await this.adminModel.find({}, { '_id': 0, '__v': 0 }).exec();
    }
    async createAdmin(adminDto) {
        const model = new this.adminModel(Object.assign({}, adminDto));
        const modelRes = await model.save();
        if (modelRes) {
            const obj = modelRes.toObject();
            delete obj._id;
            delete obj.__v;
            return obj;
        }
        return null;
    }
    async updateAdmin(adminDto) {
        const uid = adminDto.uid;
        const res = await this.adminModel.updateOne({ uid: uid }, Object.assign(Object.assign({}, adminDto), { updatedAt: moment_1.default().toDate() }));
        if (res && res.n > 0) {
            return this.getAdmin(uid);
        }
        else {
            return null;
        }
    }
    async deleteAdmin(uid) {
        const res = await this.adminModel.deleteOne({ uid: uid }).exec();
        return (res && res.deletedCount ? res.deletedCount > 0 : false);
    }
};
AdminsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectConnection()),
    __param(1, mongoose_2.InjectModel(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_1.Connection,
        mongoose_1.Model])
], AdminsService);
exports.AdminsService = AdminsService;
//# sourceMappingURL=admins.service.js.map
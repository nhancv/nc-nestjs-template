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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("@nestjs/mongoose");
const moment_1 = __importDefault(require("moment"));
const app_util_1 = require("../../utils/app.util");
const defaultProjection = { '_id': 0, '__v': 0, 'password': 0 };
let UsersService = class UsersService {
    constructor(connection, userModel) {
        this.connection = connection;
        this.userModel = userModel;
    }
    async isEmpty() {
        return (await this.userModel.estimatedDocumentCount().exec()) == 0;
    }
    async getUsers(input, fromIndex, toIndex) {
        const MAX_ITEMS_PAGING = 50;
        const from = Math.abs(fromIndex !== null && fromIndex !== void 0 ? fromIndex : 0);
        const to = Math.abs(toIndex !== null && toIndex !== void 0 ? toIndex : MAX_ITEMS_PAGING);
        const skip = Math.min(from, to);
        const limit = Math.min(MAX_ITEMS_PAGING, Math.abs(to - from));
        return await this.userModel.find(input ? {
            $or: [
                { username: new RegExp('^' + input, 'i') },
            ]
        } : {}, defaultProjection, {
            skip: skip,
            limit: limit,
            sort: { created_at: -1 }
        }).exec();
    }
    async getAllInList(uids) {
        return this.userModel.find({ uid: { '$in': uids } }, defaultProjection).exec();
    }
    async getUserByUid(uid) {
        return await this.userModel.findOne({ uid: uid }, defaultProjection).exec();
    }
    async getUserByUsernameRaw(username) {
        return await this.userModel.findOne({ username: username }).exec();
    }
    async getUserByUsername(username) {
        return await this.userModel.findOne({ username: username }, defaultProjection).exec();
    }
    async createUser(userDto) {
        const uid = app_util_1.AppUtil.nanoId();
        const fullUserDto = Object.assign(Object.assign({}, userDto), { uid: uid, password: await app_util_1.AppUtil.hash(userDto.password) });
        const userModel = new this.userModel(fullUserDto);
        const user = await userModel.save();
        if (user) {
            const obj = user.toObject();
            delete obj._id;
            delete obj.__v;
            delete obj.password;
            return obj;
        }
        return null;
    }
    async updateUser(uid, userDto) {
        if (userDto.password) {
            userDto.password = await app_util_1.AppUtil.hash(userDto.password);
        }
        const fullUserDto = Object.assign(Object.assign({}, userDto), { uid: uid });
        const res = await this.userModel.updateOne({ uid: uid }, Object.assign(Object.assign({}, fullUserDto), { updatedAt: moment_1.default().toDate() }), { upsert: true });
        if (res && res.n > 0) {
            return this.getUserByUid(uid);
        }
        else {
            return null;
        }
    }
    async deleteUser(uid) {
        const res = await this.userModel.deleteOne({ uid: uid }).exec();
        return (res && res.deletedCount ? res.deletedCount > 0 : false);
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectConnection()),
    __param(1, mongoose_2.InjectModel(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_1.Connection,
        mongoose_1.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTokenSchema = exports.AuthToken = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let AuthToken = class AuthToken extends mongoose_2.Document {
    constructor(doc, tid, uid, accessToken, duration, createdAt, updatedAt) {
        super(doc);
        this.tid = tid;
        this.uid = uid;
        this.accessToken = accessToken;
        this.duration = duration;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], AuthToken.prototype, "tid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], AuthToken.prototype, "uid", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true, unique: true }),
    __metadata("design:type", String)
], AuthToken.prototype, "accessToken", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], AuthToken.prototype, "duration", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], AuthToken.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], AuthToken.prototype, "updatedAt", void 0);
AuthToken = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [Object, String, String, String, String, Date, Date])
], AuthToken);
exports.AuthToken = AuthToken;
exports.AuthTokenSchema = mongoose_1.SchemaFactory.createForClass(AuthToken);
//# sourceMappingURL=auth-token.schema.js.map
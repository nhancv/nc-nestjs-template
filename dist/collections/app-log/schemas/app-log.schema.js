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
exports.AppLogSchema = exports.AppLog = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
let AppLog = class AppLog extends mongoose_2.Document {
    constructor(doc, type, message, index1, index2, index3, createdAt, updatedAt) {
        super(doc);
        this.type = type;
        this.message = message;
        this.index1 = index1;
        this.index2 = index2;
        this.index3 = index3;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
};
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], AppLog.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ required: true }),
    __metadata("design:type", String)
], AppLog.prototype, "message", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], AppLog.prototype, "index1", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], AppLog.prototype, "index2", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop(),
    __metadata("design:type", String)
], AppLog.prototype, "index3", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], AppLog.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiProperty(),
    mongoose_1.Prop({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], AppLog.prototype, "updatedAt", void 0);
AppLog = __decorate([
    mongoose_1.Schema(),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, Date, Date])
], AppLog);
exports.AppLog = AppLog;
exports.AppLogSchema = mongoose_1.SchemaFactory.createForClass(AppLog);
//# sourceMappingURL=app-log.schema.js.map
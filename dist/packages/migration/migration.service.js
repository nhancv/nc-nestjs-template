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
var MigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_service_1 = require("../../collections/app-config/app-config.service");
const migration_service_1_0_0_1 = require("./migration.service.1_0_0");
let MigrationService = MigrationService_1 = class MigrationService {
    constructor(configService, appConfigService, migrateService1_0_0) {
        this.configService = configService;
        this.appConfigService = appConfigService;
        this.migrateService1_0_0 = migrateService1_0_0;
        this.logger = new common_1.Logger(MigrationService_1.name);
    }
    async cloneDatabaseFromSource() {
        const sourceConnection = '';
        const targetConnection = '';
        if (!sourceConnection || sourceConnection === '' ||
            !targetConnection || targetConnection === '') {
            console.log('sourceConnection or targetConnection is null');
            return;
        }
        const mongoose = require('mongoose');
        const mongooseOption = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        };
        const sourceMongoose = await mongoose.createConnection(sourceConnection, mongooseOption);
        const targetMongoose = await mongoose.createConnection(targetConnection, mongooseOption);
        const initTables = [];
        for (let i = 0; i < initTables.length; i++) {
            const table = initTables[i];
            console.log(`Import table "${table.name}"`);
            const sourceM = sourceMongoose.model(table.name, table.schema);
            const targetM = targetMongoose.model(table.name, table.schema);
            const clearRes = await targetM.deleteMany({});
            console.log(`clear target: ${clearRes && clearRes.n > 0}`);
            const allRow = await sourceM.find();
            let successCount = 0;
            for (let r = 0; r < allRow.length; r++) {
                const m = allRow[r].toObject();
                const res = await targetM.create(m);
                if (res) {
                    successCount++;
                }
            }
            console.log(`imported, success ${successCount}/${allRow.length}`);
        }
        console.log('DONE');
        return;
    }
    async migrate() {
        const appConfig = await this.initAppConfigCollection();
        if (appConfig) {
            const currentAppVersion = appConfig.version;
            let nextVersion;
            switch (currentAppVersion) {
                case '0.0.0':
                default:
                    nextVersion = '0.0.0';
                    break;
            }
            if (nextVersion !== currentAppVersion) {
                this.logger.debug(`Current version: ${currentAppVersion} => ${nextVersion}`);
                await this.appConfigService.putAppConfig(Object.assign(Object.assign({}, appConfig.toObject()), { version: nextVersion }));
            }
        }
    }
    async initAppConfigCollection() {
        let appConfig = await this.appConfigService.getAppConfig();
        if (!appConfig || !appConfig.version) {
            appConfig = await this.appConfigService.putAppConfig({
                version: '0.0.0',
                maintenance: false,
            });
        }
        return appConfig;
    }
};
MigrationService = MigrationService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        app_config_service_1.AppConfigService,
        migration_service_1_0_0_1.MigrationService1_0_0])
], MigrationService);
exports.MigrationService = MigrationService;
//# sourceMappingURL=migration.service.js.map
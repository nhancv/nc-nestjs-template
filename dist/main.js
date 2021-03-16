"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app/app.module");
const all_exception_filter_1 = require("./utils/all.exception.filter");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const morgan_1 = __importDefault(require("morgan"));
const moment_1 = __importDefault(require("moment"));
async function bootstrap() {
    var _a;
    const logger = new common_1.Logger('main');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    morgan_1.default.token('date', (req, res, tz) => moment_1.default().utc().utcOffset("+0700").format());
    const morganFormat = '[:date] :method :url :status - :response-time ms :user-agent';
    app.use(morgan_1.default(morganFormat));
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new all_exception_filter_1.AllExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe());
    const options = new swagger_1.DocumentBuilder()
        .setTitle('The API document')
        .setDescription('----------')
        .setVersion((_a = process.env.npm_package_version) !== null && _a !== void 0 ? _a : '')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = parseInt(process.env.PORT || '3000');
    await app.listen(port, '0.0.0.0');
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().then();
//# sourceMappingURL=main.js.map
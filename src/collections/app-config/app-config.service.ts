import {Injectable, Logger} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {AppConfig} from "./schemas/app-config.schema";
import {AppConfigDto} from "./dto/app-config.dto";
import moment from "moment";

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(AppConfig.name) private appConfigModel: Model<AppConfig>,
  ) {
  }

  async getAppConfig(): Promise<AppConfig | null> {
    return this.appConfigModel.findOne().exec();
  }

  async putAppConfig(appConfigDto: AppConfigDto): Promise<AppConfig | null> {
    await this.appConfigModel.updateOne({}, {
      ...appConfigDto,
      updatedAt: moment().toDate(),
    }, {upsert: true});
    return this.getAppConfig();
  }

}

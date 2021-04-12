import {Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {AppLog} from "./schemas/app-log.schema";
import {CreateAppLogDto} from "./dto/create-app-log.dto";

@Injectable()
export class AppLogService {

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(AppLog.name) private appLogModel: Model<AppLog>,
  ) {
  }

  // Find app log by type
  async findAppLogs(type: string): Promise<AppLog[]> {
    return await this.appLogModel.find({type: type}, {'__v': 0}).exec();
  }

  // Find app log by custom filter
  async findAppLogsByFilter(filter: any): Promise<AppLog[]> {
    return await this.appLogModel.find(filter, {'__v': 0}).exec();
  }

  // Create app log
  async createAppLog(createAppLogDto: CreateAppLogDto): Promise<AppLog | null> {
    const appLogModel = new this.appLogModel(createAppLogDto);
    return await appLogModel.save();
  }

}

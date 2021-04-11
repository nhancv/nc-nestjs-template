import {Injectable} from '@nestjs/common';
import {Connection, Model} from "mongoose";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Admin} from "./schemas/admin.schema";
import {AdminDto} from "./dto/admin.dto";
import moment from "moment";

@Injectable()
export class AdminsService {

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
  ) {
  }

  async isEmpty(): Promise<boolean> {
    return (await this.adminModel.estimatedDocumentCount().exec()) == 0;
  }

  async getAdmin(uid: string): Promise<Admin | null> {
    return await this.adminModel.findOne({uid: uid}, {'_id': 0, '__v': 0}).exec();
  }

  async getAdmins(): Promise<Admin[]> {
    return await this.adminModel.find({}, {'_id': 0, '__v': 0}).exec();
  }

  async createAdmin(adminDto: AdminDto): Promise<Admin | null> {
    const model = new this.adminModel({
      ...adminDto
    });
    const modelRes = await model.save();
    if (modelRes) {
      const obj = modelRes.toObject<Admin>();
      delete obj._id;
      delete obj.__v;
      return obj;
    }
    return null;
  }

  async updateAdmin(adminDto: AdminDto): Promise<Admin | null> {
    const uid = adminDto.uid;
    const res = await this.adminModel.updateOne({uid: uid}, {
      ...adminDto,
      updatedAt: moment().toDate(),
    });
    if (res && res.n > 0) {
      return this.getAdmin(uid);
    } else {
      return null;
    }
  }

  async deleteAdmin(uid: string): Promise<boolean> {
    const res = await this.adminModel.deleteOne({uid: uid}).exec();
    return (res && res.deletedCount ? res.deletedCount > 0 : false);
  }

}

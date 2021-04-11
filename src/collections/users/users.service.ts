import {Injectable} from '@nestjs/common';
import {Connection, Model} from "mongoose";
import {User} from "./schemas/user.schema";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {UpdateUserDto} from "./dto/update-user.dto";
import {FullUserDto} from "./dto/full-user.dto";
import moment from "moment";
import {AppUtil} from "../../utils/app.util";
import {CreateUserDto} from "./dto/create-user.dto";

const defaultProjection = {'_id': 0, '__v': 0, 'password': 0};

@Injectable()
export class UsersService {

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
  }

  async isEmpty(): Promise<boolean> {
    return (await this.userModel.estimatedDocumentCount().exec()) == 0;
  }

  // Search users
  // Input: username
  // If input is undefined, return all
  async getUsers(input?: string, fromIndex?: number, toIndex?: number): Promise<User[]> {
    const MAX_ITEMS_PAGING = 50;
    const from = Math.abs(fromIndex ?? 0);
    const to = Math.abs(toIndex ?? MAX_ITEMS_PAGING);
    const skip = Math.min(from, to);
    const limit = Math.min(MAX_ITEMS_PAGING, Math.abs(to - from));
    return await this.userModel.find(input ? {
        $or: [
          {username: new RegExp('^' + input, 'i')},
        ]
      } : {},
      defaultProjection,
      {
        skip: skip,
        limit: limit,
        sort: {created_at: -1}
      }).exec();
  }

  // Get users in a uid list
  async getAllInList(uids: string[]): Promise<User[]> {
    return this.userModel.find({uid: {'$in': uids}}, defaultProjection).exec();
  }

  // Get user information by uid
  async getUserByUid(uid: string): Promise<User | null> {
    return await this.userModel.findOne({uid: uid}, defaultProjection).exec();
  }

  // Get user information by username
  // Return full user object with password to verify
  async getUserByUsernameRaw(username: string): Promise<User | null> {
    return await this.userModel.findOne({username: username}).exec();
  }

  // Get user information by username
  async getUserByUsername(username: string): Promise<User | null> {
    return await this.userModel.findOne({username: username}, defaultProjection).exec();
  }

  async createUser(userDto: CreateUserDto): Promise<User | null> {
    const uid = AppUtil.nanoId();
    const fullUserDto: FullUserDto = {
      ...userDto,
      uid: uid,
      password: await AppUtil.hash(userDto.password)
    }
    const userModel = new this.userModel(fullUserDto);
    const user = await userModel.save();
    if (user) {
      const obj = user.toObject<User>();
      delete obj._id;
      delete obj.__v;
      delete obj.password;
      return obj;
    }
    return null;
  }

  async updateUser(uid: string, userDto: UpdateUserDto): Promise<User | null> {
    if (userDto.password) {
      userDto.password = await AppUtil.hash(userDto.password);

    }
    const fullUserDto: FullUserDto = {
      ...userDto,
      uid: uid
    }
    const res = await this.userModel.updateOne({uid: uid}, {
      ...fullUserDto,
      updatedAt: moment().toDate(),
    }, {upsert: true});
    if (res && res.n > 0) {
      return this.getUserByUid(uid);
    } else {
      return null;
    }
  }

  async deleteUser(uid: string): Promise<boolean> {
    const res = await this.userModel.deleteOne({uid: uid}).exec();
    return (res && res.deletedCount ? res.deletedCount > 0 : false);
  }

}

import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UserRoleDto} from "../users/dto/user-role.dto";
import {User} from "../users/schemas/user.schema";
import {JwtPayload} from "./jwt.payload";
import {UsersService} from "../users/users.service";
import {AdminsService} from "../admins/admins.service";
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {AuthTokenDto} from "./dto/auth-token.dto";
import {AuthToken} from "./schemas/auth-token.schema";
import {LoginDto} from "./dto/login.dto";
import {TokenResponse} from "./responses/token.response";
import {AppUtil} from "../../utils/app.util";

@Injectable()
export class AuthService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(AuthToken.name) private accessTokenModel: Model<AuthToken>,
    private readonly jwtService: JwtService,
    private readonly adminsService: AdminsService,
    private readonly usersService: UsersService,
  ) {
  }

  async login(loginDto: LoginDto): Promise<TokenResponse> {

    const user = await this.usersService.getUserByUsernameRaw(loginDto.username);
    const loginPassword = loginDto.password;
    const userPassword = user?.password;
    if (user && userPassword && await AppUtil.hashVerify(loginPassword, userPassword)) {
      const tokenDuration = process.env.EXPIRES_IN ?? '-';

      const tid = AppUtil.nanoId();
      const uid = user.uid;
      const payload: JwtPayload = {uid: uid, tid: tid};
      const accessToken = this.jwtService.sign(payload);
      await this.createAuthToken({
        tid: tid,
        uid: uid,
        accessToken: accessToken,
        duration: tokenDuration,
      })

      // User projection to remove password
      const obj = user.toObject<User>();
      delete obj._id;
      delete obj.__v;
      delete obj.password;

      return {
        user: obj,
        accessToken: accessToken,
        expiresIn: tokenDuration,
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  // Get tokens by Uid
  async getAuthTokenByTid(tid: string): Promise<AuthToken | null> {
    return await this.accessTokenModel.findOne({tid: tid}, {'_id': 0, '__v': 0}).exec();
  }

  // Get tokens by Uid
  async getAuthTokensByUid(uid: string): Promise<AuthToken[] | null> {
    return await this.accessTokenModel.find({uid: uid}, {'_id': 0, '__v': 0}).exec();
  }

  // Get tokens by Uid
  async getAuthTokenByAccessToken(accessToken: string): Promise<AuthToken | null> {
    return await this.accessTokenModel.findOne({accessToken: accessToken}, {'_id': 0, '__v': 0}).exec();
  }

  // Delete auth token via token id
  async deleteAuthToken(tid: string): Promise<boolean> {
    const res = await this.accessTokenModel.deleteOne({tid: tid}).exec();
    return (res && res.deletedCount ? res.deletedCount > 0 : false);
  }

  // Delete all auth token of user
  async deleteAuthTokens(uid: string): Promise<boolean> {
    const res = await this.accessTokenModel.deleteMany({uid: uid}).exec();
    return (res && res.deletedCount ? res.deletedCount > 0 : false);
  }

  // Create auth token
  async createAuthToken(createAuthTokenDto: AuthTokenDto): Promise<AuthToken | null> {
    const accessToken = createAuthTokenDto.accessToken;
    const userModel = new this.accessTokenModel(createAuthTokenDto);
    const user = await userModel.save();
    if (user) {
      return this.getAuthTokenByAccessToken(accessToken);
    }
    return null;
  }

  // Validate user using jwt token
  async validateUser(payload: JwtPayload): Promise<User | null> {
    const uid = payload.uid;
    const tid = payload.tid;
    const authToken = await this.getAuthTokenByTid(tid);
    if (!authToken) {
      return null;
    }
    const user = await this.usersService.getUserByUid(uid);
    if (!user) {
      return null;
    } else {
      const userWRole: UserRoleDto = user.toObject<User>();
      const admin = await this.adminsService.getAdmin(uid);
      if (admin && admin.role) {
        userWRole.role = admin.role;
      }
      return userWRole;
    }
  }

  // Verify jwt token using jwt service
  async verifyAsync(jwtToken: string): Promise<any> {
    return this.jwtService.verifyAsync(jwtToken);
  }

  // Decode jwt using jwt service
  decodeJwt(jwtToken: string): null | {
    [key: string]: any;
  } | string {
    return this.jwtService.decode(jwtToken);
  }


}

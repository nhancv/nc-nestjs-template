import {Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, Query, UseGuards,} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import {BaseResponse, ErrorResponseType} from "../../utils/base.response";
import {AuthJwt} from "../auth/auth.decorator";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {JwtPayload} from "../auth/jwt.payload";
import {User} from "./schemas/user.schema";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UsersService} from "./users.service";
import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";
import {CreateUserDto} from "./dto/create-user.dto";
import {AuthService} from "../auth/auth.service";

@ApiTags('users')
@Controller('users')
export class UsersController {

  private logger: Logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
  }

  @ApiOkResponse({
    description: 'List of user',
    type: [User],
  })
  @ApiImplicitQuery({name: 'input', required: false})
  @ApiImplicitQuery({name: 'from', required: false})
  @ApiImplicitQuery({name: 'to', required: false})
  @ApiBearerAuth()
  @ApiOperation({summary: 'Search by username. Leave empty to get all.'})
  @Get('search')
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query('input') input: string,
    @Query('from') from: number,
    @Query('to') to: number,
    @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User[] | null>> {
    const response: BaseResponse<User[] | null> = {}
    response.data = await this.usersService.getUsers(input, from, to);
    return response;
  }

  @ApiOkResponse({
    description: 'User info',
    type: User,
  })
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get me'})
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMe(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<User | null> = {}
    response.data = await this.usersService.getUserByUid(payload.uid);
    return response;
  }

  @ApiOkResponse({
    description: 'Get user info',
    type: User,
  })
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user info'})
  @Get(':uid')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Param('uid') uid: string, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<User | null> = {}
    response.data = await this.usersService.getUserByUid(uid);
    return response;
  }

  // @HttpCode(201)
  @ApiCreatedResponse({
    description: 'User info',
    type: User,
  })
  @ApiNotAcceptableResponse({
    description: 'User exist.',
    type: ErrorResponseType,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ErrorResponseType,
  })
  @ApiBody({type: CreateUserDto})
  @ApiOperation({summary: 'Create user'})
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<any> = {};

    // Check user available
    if (user.username) {
      const exist = (await this.usersService.getUsers(user.username)).length > 0;
      if (!exist) {
        response.data = await this.usersService.createUser(user);
      } else {
        response.error = {
          code: HttpStatus.NOT_ACCEPTABLE,
          message: "User exist."
        }
      }
    } else {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "username is empty"
      }
    }
    return response;
  }

  @ApiOkResponse({
    description: 'User info',
    type: User,
  })
  @ApiBody({type: UpdateUserDto})
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update me'})
  @Put()
  @UseGuards(JwtAuthGuard)
  async updateMe(@Body() userDto: UpdateUserDto, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<User | null>> {
    const response: BaseResponse<any> = {};
    const uid = payload.uid;

    // Username is available
    const userByUsername = await this.usersService.getUserByUid(uid);
    if (!userByUsername || userByUsername.uid === uid) {
      const user = await this.usersService.updateUser(uid, userDto);
      if (user && userDto.password) {
        await this.authService.deleteAuthTokens(uid);
      }
      response.data = user;
    } else {
      response.error = {
        code: HttpStatus.NOT_ACCEPTABLE,
        message: "username is not available."
      }
    }

    return response;
  }

  @ApiOperation({summary: 'Delete user'})
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'true or false',
    type: Boolean,
  })
  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<boolean>> {
    const response: BaseResponse<boolean> = {}
    response.data = await this.usersService.deleteUser(payload.uid);
    return response;
  }

}

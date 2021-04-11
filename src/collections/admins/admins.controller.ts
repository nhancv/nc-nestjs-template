import {Body, Controller, Delete, Get, HttpStatus, Logger, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {AdminsService} from "./admins.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Admin} from "./schemas/admin.schema";
import {AuthJwt} from "../auth/auth.decorator";
import {BaseResponse} from "../../utils/base.response";
import {JwtPayload} from "../auth/jwt.payload";
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles.decorator";
import {ROLE_ADMIN, ROLE_OWNER} from "./dto/admin.roles";
import {AdminDto} from "./dto/admin.dto";

@ApiTags('admins')
@Controller('admins')
export class AdminsController {

  private logger: Logger = new Logger(AdminsController.name);

  constructor(
    private readonly adminsService: AdminsService,
  ) {
  }

  // Get admin info.
  // Only admin can get other admins info
  @ApiOkResponse({
    description: 'Admin info',
    type: Admin,
  })
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get admin info'})
  @Get()
  @Roles(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAdmin(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<Admin>> {
    const response: BaseResponse<Admin> = {}
    const uid = payload.uid;
    const admin = await this.adminsService.getAdmin(uid);
    if (!admin) {
      response.error = {
        code: HttpStatus.NOT_FOUND,
        message: "Admin was not found."
      }
    } else {
      response.data = admin;
    }
    return response;
  }

  @ApiOkResponse({
    description: 'Admin list',
    type: [Admin],
  })
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get all admins'})
  @Get('all')
  @Roles(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllAdmins(@AuthJwt() payload: JwtPayload): Promise<BaseResponse<Admin[]>> {
    const response: BaseResponse<Admin[]> = {}
    response.data = await this.adminsService.getAdmins();
    return response;
  }

  @ApiOkResponse({
    description: 'Admin info',
    type: Admin,
  })
  @ApiBody({type: AdminDto})
  @ApiBearerAuth()
  @ApiOperation({summary: 'Create new admin'})
  @Post()
  @Roles(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createAdmin(@Body() adminDto: AdminDto, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<Admin>> {
    const response: BaseResponse<Admin> = {}
    response.data = await this.adminsService.createAdmin(adminDto);
    return response;
  }

  @ApiOkResponse({
    description: 'admin info',
    type: Admin,
  })
  @ApiBody({type: AdminDto})
  @ApiBearerAuth()
  @ApiOperation({summary: 'Update admin'})
  @Put()
  @Roles(ROLE_OWNER, ROLE_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateAdmin(@Body() adminDto: AdminDto, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<Admin>> {
    const response: BaseResponse<Admin> = {}
    response.data = await this.adminsService.updateAdmin(adminDto);
    return response;
  }

  @ApiOkResponse({
    description: 'true/false',
    type: Boolean,
  })
  @ApiBearerAuth()
  @ApiOperation({summary: 'Delete admin - owner only'})
  @Delete(':uid')
  @Roles(ROLE_OWNER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteAdmin(@Param('uid') adminId: string, @AuthJwt() payload: JwtPayload): Promise<BaseResponse<boolean>> {
    const response: BaseResponse<boolean> = {}
    response.data = await this.adminsService.deleteAdmin(adminId);
    return response;
  }
}

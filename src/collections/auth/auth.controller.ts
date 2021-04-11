import {Body, Controller, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {UsersService} from "../users/users.service";
import {BaseResponse} from "../../utils/base.response";
import {ApiBody, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {LoginDto} from "./dto/login.dto";
import {TokenResponseDto} from "./dto/token-response.dto";
import {TokenResponse} from "./responses/token.response";

@ApiTags('auth')
@Controller('auth')
export class AuthController {

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
  }

  @ApiOkResponse({
    description: 'token info',
    type: TokenResponseDto,
  })
  @ApiBody({type: LoginDto})
  @ApiOperation({summary: 'Login with username password'})
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<BaseResponse<TokenResponse>> {
    const response: BaseResponse<TokenResponse> = {}
    response.data = await this.authService.login(loginDto);
    return response;
  }

}

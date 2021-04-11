import {Controller} from '@nestjs/common';
import {RealtimeService} from "./realtime.service";
import {ApiTags} from "@nestjs/swagger";
import {UsersService} from "../../collections/users/users.service";

@ApiTags('realtime')
@Controller('realtime')
export class RealtimeController {

  constructor(
    private usersService: UsersService,
    private realtimeService: RealtimeService,
  ) {
  }

}

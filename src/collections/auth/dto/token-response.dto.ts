import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../users/schemas/user.schema";

export class TokenResponseDto {

  @ApiProperty({type: User})
  user: User | null;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expiresIn: string

  constructor(user: User | null, accessToken: string, expiresIn: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.expiresIn = expiresIn;
  }
}

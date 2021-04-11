import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {

  @ApiProperty()
  username?: string;

  @ApiProperty()
  password?: string;

  @ApiProperty()
  fullName?: string;

  constructor(username: string, password: string, fullName: string) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
  }
}

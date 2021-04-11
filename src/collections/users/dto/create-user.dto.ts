import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @ApiProperty()
  fullName?: string;

  constructor(username: string, password: string, fullName: string) {
    this.username = username;
    this.password = password;
    this.fullName = fullName;
  }
}

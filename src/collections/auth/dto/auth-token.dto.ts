import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class AuthTokenDto {

  @IsNotEmpty()
  @ApiProperty()
  tid: string; // token id

  @IsNotEmpty()
  @ApiProperty()
  uid: string; // user id

  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsNotEmpty()
  @ApiProperty()
  duration: string;

  constructor(tid: string, uid: string, accessToken: string, duration: string) {
    this.tid = tid;
    this.uid = uid;
    this.accessToken = accessToken;
    this.duration = duration;
  }
}

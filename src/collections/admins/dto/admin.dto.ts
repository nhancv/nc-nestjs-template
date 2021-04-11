import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class AdminDto {

  @IsNotEmpty()
  @ApiProperty()
  uid: string;

  @IsNotEmpty()
  @ApiProperty()
  role: string;

  constructor(uid: string, role: string) {
    this.uid = uid;
    this.role = role;
  }
}

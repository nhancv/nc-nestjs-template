import {UpdateUserDto} from "./update-user.dto";

export class FullUserDto extends UpdateUserDto {

  uid: string;

  constructor(username: string, password: string, fullName: string, uid: string) {
    super(username, password, fullName);
    this.uid = uid;
  }
}

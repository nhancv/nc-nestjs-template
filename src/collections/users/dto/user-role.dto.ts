import {User} from "../schemas/user.schema";

export class UserRoleDto extends User {
  role?: string;
}

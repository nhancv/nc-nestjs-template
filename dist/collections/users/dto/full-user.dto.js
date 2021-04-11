"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullUserDto = void 0;
const update_user_dto_1 = require("./update-user.dto");
class FullUserDto extends update_user_dto_1.UpdateUserDto {
    constructor(username, password, fullName, uid) {
        super(username, password, fullName);
        this.uid = uid;
    }
}
exports.FullUserDto = FullUserDto;
//# sourceMappingURL=full-user.dto.js.map
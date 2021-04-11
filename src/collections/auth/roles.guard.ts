import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.indexOf(user.role) > -1;
  }
}

// How to use
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin')
// Error response - Not match with role:
// {
//     "error": {
//         "code": 403,
//         "message": "Forbidden resource"
//     }
// }

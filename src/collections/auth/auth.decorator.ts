import * as nestjsCommon from '@nestjs/common';
// https://stackoverflow.com/questions/57833669/how-to-get-jwt-token-from-headers-in-controller
/**
 * retrieve the current user with a decorator
 * example of a controller method:
 * @Post()
 * someMethod(@AuthJwt() payload: JwtPayload) {
 *   // do something with the jwt payload
 * }
 *
 * Remember: request.user = result of JwtStrategy().validate()
 */

export const AuthJwt = nestjsCommon.createParamDecorator(
  (data: unknown, ctx: nestjsCommon.ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {JwtPayload} from "./jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  // For each strategy,
  // Passport will call the verify function (implemented with the validate() method in @nestjs/passport)
  // using an appropriate strategy-specific set of parameters
  // https://docs.nestjs.com/techniques/authentication
  async validate(payload: JwtPayload): Promise<any> {
    // payload
    // {
    //   uid: 'guest_nJn6nS8pSbvWJCXhvciSKBAl3LkRYl',
    //   iat: 1603065903,
    //   exp: 1603152303
    // }
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }

}

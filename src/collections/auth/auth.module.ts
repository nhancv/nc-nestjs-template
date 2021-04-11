import {forwardRef, Module} from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {JwtStrategy} from "./jwt.strategy";
import {AuthController} from "./auth.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {UsersModule} from "../users/users.module";
import {AdminsModule} from "../admins/admins.module";
import {MongooseModule} from "@nestjs/mongoose";
import {AuthToken, AuthTokenSchema} from "./schemas/auth-token.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{name: AuthToken.name, schema: AuthTokenSchema}]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
    AdminsModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {
}

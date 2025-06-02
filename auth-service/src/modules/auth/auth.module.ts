import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RmqModule } from '../../rmq/rmq.module';
import { AuthGateway } from './auth.gateway';
import { AUTH_SERVICE } from '../../common/constant';

@Module({
  imports: [
    UsersModule, 
    PassportModule, 
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  controllers: [AuthController, AuthGateway],
  providers: [AuthService, JwtStrategy, AuthGateway], 
  exports: [AuthService],
})
export class AuthModule {}

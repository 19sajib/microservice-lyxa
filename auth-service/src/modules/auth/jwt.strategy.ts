import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './dto/jwt-payload.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService, 
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), 
      ignoreExpiration: false, 
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }


  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    const user = await this.usersService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
   
    return { id: payload.id, email: payload.email, roles: payload.roles };
  }
}
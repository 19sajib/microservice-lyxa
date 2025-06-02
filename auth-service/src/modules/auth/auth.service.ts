import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { TokenResponseDto } from './dto/token-response.dto';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, USER_CREATED_EVENT } from '../../common/constant';
import { Inject } from '@nestjs/common';
import { IJwtPayload } from './dto/jwt-payload.dto';
import { User } from '../users/schemas/user.schema';
import { Role } from '../../common/role.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy, // Injecting the RabbitMQ client
  ) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const { email, password, name } = registerDto;

    // Checking if user with this email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      roles: [Role.User],
    });

    // Publishing user.created event to RabbitMQ
    this.authClient.emit(USER_CREATED_EVENT, {
      userId: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles,
      createdAt: user.createdAt,
    });
    this.logger.log(`Published '${USER_CREATED_EVENT}' event for user: ${user.email}`);

    // Generate and return tokens
    return this.generateTokens(user.id, user.email, user.roles);
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmailForLogin(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate and return tokens
    return this.generateTokens(user.id, user.email, user.roles);
  }


  async logout(userId: string): Promise<void> {
    // In a real application, we would typically: Invalidate the refresh token associated with this user.
    this.logger.log(`User ${userId} logged out (refresh token invalidate logic not implemented in this example).`);
  }

  async generateTokens(userId: string, email?: string, roles?: string[]): Promise<TokenResponseDto> {
    let user: User;
    if (!email || !roles) {
      user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      email = user.email;
      roles = user.roles;
    }

    const payload: IJwtPayload = {
      id: userId,
      email: email,
      roles: roles,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      secret: this.configService.get<string>('JWT_SECRET') + '_refresh',
    });

    return { accessToken, refreshToken };
  }

  async validateToken(token: string): Promise<IJwtPayload> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const user = await this.usersService.findById(payload.id);
      if (!user) {
        throw new UnauthorizedException('User associated with token not found');
      }
      return payload;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

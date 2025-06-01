import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from './dto/jwt-payload.dto';
import { Role } from '../../common/role.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.', type: TokenResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., validation errors, email already exists).' })
  async register(@Body() registerDto: RegisterDto): Promise<TokenResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and get tokens' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized (e.g., invalid credentials).' })
  async login(@Body() loginDto: LoginDto): Promise<TokenResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user (invalidate refresh token)' })
  @ApiBearerAuth() 
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard) 
  async logout(@CurrentUser('id') userId: string): Promise<{ message: string }> {
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Access token refreshed.', type: TokenResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid refresh token).' })
  @UseGuards(JwtAuthGuard) 
  async refreshToken(@CurrentUser('id') userId: string): Promise<TokenResponseDto> {
    return this.authService.generateTokens(userId);
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user profile (requires authentication)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User profile data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: IJwtPayload) {
    return user; 
  }

  @Get('admin-only')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin-only endpoint' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Access granted to admin.' })
  @ApiResponse({ status: 403, description: 'Forbidden (user does not have admin role).' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAdminData(@CurrentUser() user: IJwtPayload) {
    return { message: `Welcome, Admin ${user.email}! This is confidential data.` };
  }
}
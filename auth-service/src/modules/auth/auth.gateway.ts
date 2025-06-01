import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { VALIDATE_TOKEN_PATTERN } from '../../common/constant';
import { IJwtPayload } from './dto/jwt-payload.dto'
import { RpcException } from '@nestjs/microservices';

@Controller()
export class AuthGateway {
  private readonly logger = new Logger(AuthGateway.name);

  constructor(private readonly authService: AuthService) {}

  @MessagePattern(VALIDATE_TOKEN_PATTERN)
  async validateToken(@Payload() data: { token: string }): Promise<IJwtPayload> {
    this.logger.debug(`Received token validation request for token: ${data.token ? data.token.substring(0, 30) + '...' : 'N/A'}`);
    try {
      if (!data.token) {
        throw new RpcException('Token is missing');
      }
      const payload = await this.authService.validateToken(data.token);
      this.logger.debug(`Token validated successfully for user: ${payload.email}`);
      return payload;
    } catch (error) {
      this.logger.error(`Token validation failed for RPC call: ${error.message}`);
      // Re-throw as RpcException to be caught by the RpcExceptionFilter
      throw new RpcException(error.message);
    }
  }
}

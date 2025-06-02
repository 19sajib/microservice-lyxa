import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthClientService } from '../../modules/auth-client/auth-client.service';
import { firstValueFrom, timeout } from 'rxjs';
import { IJwtPayload } from '../../modules/auth-client/dto/jwt-payload.dto';

@Injectable()
export class JwtAuthGuard {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly authClientService: AuthClientService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided or invalid token format');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Send the token to the Auth Service for validation via RabbitMQ
      const userPayload: IJwtPayload = await firstValueFrom(
        this.authClientService.validateToken(token).pipe(timeout(5000)),
      );

      if (!userPayload) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Attach the validated user payload to the request object
      request.user = userPayload;
      return true;
    } catch (error) {
      this.logger.error(`JWT validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

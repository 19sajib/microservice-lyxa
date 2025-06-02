import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE_QUEUE, VALIDATE_TOKEN_PATTERN } from '../../common/constants';
import { Observable } from 'rxjs';
import { IJwtPayload } from './dto/jwt-payload.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Injectable()
export class AuthClientService {
  private readonly logger = new Logger(AuthClientService.name);

  constructor(
    @Inject(AUTH_SERVICE_QUEUE) private readonly authClient: ClientProxy,
  ) {}

  /**
   * Sends a message to the Auth Service to validate a JWT token.
   * @param token - The JWT token string to validate.
   * @returns An Observable that emits the decoded JWT payload if valid.
   */
  validateToken(token: string): Observable<IJwtPayload> {
    this.logger.debug(`Sending token validation request to ${AUTH_SERVICE_QUEUE} for token: ${token ? token.substring(0, 30) + '...' : 'N/A'}`);
    return this.authClient.send<IJwtPayload, ValidateTokenDto>(VALIDATE_TOKEN_PATTERN, { token });
  }

}

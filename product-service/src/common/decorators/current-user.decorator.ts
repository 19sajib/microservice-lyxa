import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../modules/auth-client/dto/jwt-payload.dto';

export const CurrentUser = createParamDecorator(
  (data: keyof IJwtPayload | undefined, context: ExecutionContext) => {
    // For HTTP requests
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      // The user object is attached to the request by the JwtAuthGuard
      return data ? request.user[data] : request.user;
    }
    return null;
  },
);
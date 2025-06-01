import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../modules/auth/dto/jwt-payload.dto';

export const CurrentUser = createParamDecorator(
  (data: keyof IJwtPayload | undefined, context: ExecutionContext) => {
    // For HTTP requests
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return data ? request.user[data] : request.user;
    }

    // For RPC (microservice) requests, assuming user data is passed in the data payload
    if (context.getType() === 'rpc') {
      const rpcData = context.switchToRpc().getData();
      // Assuming the microservice message payload contains a 'user' property
      return data ? rpcData.user[data] : rpcData.user;
    }

    return null;
  },
);

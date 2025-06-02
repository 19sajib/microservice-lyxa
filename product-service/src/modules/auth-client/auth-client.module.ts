import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { RmqModule } from '../rmq/rmq.module';
import { AUTH_SERVICE_QUEUE } from '../../common/constants';

@Module({
  imports: [
    // Register the RMQ client for the Auth Service
    RmqModule.register({
      name: AUTH_SERVICE_QUEUE, 
      queue: AUTH_SERVICE_QUEUE,
    }),
  ],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}

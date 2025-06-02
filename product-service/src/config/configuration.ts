import { registerAs } from '@nestjs/config';

export const configuration = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  mongodbUri: process.env.MONGODB_URI,
  rabbitmqUri: process.env.RABBITMQ_URI,
  authServiceQueue: process.env.AUTH_SERVICE_QUEUE || 'auth_queue',
}));
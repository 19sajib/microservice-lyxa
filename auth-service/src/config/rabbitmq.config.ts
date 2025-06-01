import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
  queuePrefix: process.env.RABBITMQ_QUEUE_PREFIX || 'auth-service',
  exchange: process.env.RABBITMQ_EXCHANGE || 'auth-exchange',
}));
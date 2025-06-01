import { registerAs } from '@nestjs/config';

export const configuration = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI,
  rabbitmqUri: process.env.RABBITMQ_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtAccessTokenExpirationTime: parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || '3600', 10),
  jwtRefreshTokenExpirationTime: parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || '604800', 10),
}));
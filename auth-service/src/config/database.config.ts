import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/auth-service',
  name: process.env.MONGODB_DATABASE_NAME || 'auth-service',
}));
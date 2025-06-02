import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3001),
  MONGODB_URI: Joi.string().required(),
  RABBITMQ_URI: Joi.string().required(),
  AUTH_SERVICE_QUEUE: Joi.string().default('auth_queue'),
});

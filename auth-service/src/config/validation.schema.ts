import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGODB_URI: Joi.string().required(),
  RABBITMQ_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().default(3600),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().default(604800),
});

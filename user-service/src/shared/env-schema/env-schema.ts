import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  USER_SVC_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRE: Joi.string().required(),
});

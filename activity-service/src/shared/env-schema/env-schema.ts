import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string().required(),
  ACTIVITY_SVC_URL: Joi.string().required(),
  KAFKA_BROKER_URL: Joi.string().required(),
});

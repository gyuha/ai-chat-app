import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri({ scheme: ['file', 'sqlite', 'postgres', 'postgresql'] }).required(),
  JWT_ACCESS_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_TTL: Joi.string().required(),
  JWT_REFRESH_TTL: Joi.string().required(),
  OPENROUTER_API_KEY: Joi.string().required(),
  OPENROUTER_MODEL: Joi.string().required(),
  FRONTEND_ORIGIN: Joi.string().uri().required(),
  PORT: Joi.number().port().required(),
});

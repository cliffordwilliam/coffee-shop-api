// src/config/env.ts
import dotenv from 'dotenv';
import Joi from 'joi';

// Load .env into process.env
dotenv.config();

// Define validation schema
const envSchema = Joi.object({
  API_PREFIX: Joi.string().default('/api'),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_URL: Joi.string().required(),
}).unknown(true); // Allow other variables

// Validate environment variables
const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
});

if (error) {
  console.error('❌ Invalid environment variables:', error.message);
  process.exit(1);
}

// Export validated and typed env
export const env = {
  apiPrefix: envVars.API_PREFIX,
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV as 'development' | 'production' | 'test',
  postgres: {
    containerUrl: envVars.DATABASE_URL,
  },
};

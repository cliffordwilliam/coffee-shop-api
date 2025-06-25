// src/config/env.ts
import dotenv from 'dotenv';
import Joi from 'joi';

// Load .env into process.env
dotenv.config();

// Define validation schema
const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
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
  port: envVars.PORT,
  postgres: {
    containerUrl: envVars.DATABASE_URL,
  },
};

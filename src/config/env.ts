import dotenv from "dotenv";
import Joi from "joi";
import { NODE_ENVS, NodeEnv } from "@/constants/env";

// Load .env into process.env
dotenv.config();

// Create Joi obj for process.env validation
const envSchema = Joi.object({
  API_PREFIX: Joi.string(),
  PORT: Joi.number(),
  LOCALHOST: Joi.string(),
  PROTOCOL: Joi.string(),
  NODE_ENV: Joi.string().valid(
    NODE_ENVS.DEVELOPMENT,
    NODE_ENVS.PRODUCTION,
    NODE_ENVS.TEST,
    NODE_ENVS.CI,
  ),
  DATABASE_URL: Joi.string().required(),
}).unknown(true); // Allow other variables, some extra are configs not for this app

// Use Joi to validate process.env
const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false, // Report all validation errors
  allowUnknown: true, // Allow extra environment variables
  stripUnknown: true, // Remove unknown variables from the result
});

// If process.env invalid, quit, cannot use logger here, everyone uses me including logger so cyclic
if (error) {
  console.error("❌ Invalid environment variables:", error.message);
  process.exit(1);
}

// Export validated process.env for codebase to use
export const env = {
  apiPrefix: envVars.API_PREFIX,
  port: envVars.PORT,
  localhost: envVars.LOCALHOST,
  protocol: envVars.PROTOCOL,
  nodeEnv: envVars.NODE_ENV as NodeEnv,
  postgres: {
    containerUrl: envVars.DATABASE_URL,
  },
};

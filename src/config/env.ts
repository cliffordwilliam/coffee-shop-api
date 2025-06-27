import dotenv from "dotenv";
import Joi from "joi";

// Load .env into process.env
dotenv.config();

// Create Joi obj for process.env validation
const envSchema = Joi.object({
  API_PREFIX: Joi.string().default("/api"),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  DATABASE_URL: Joi.string().required(),
}).unknown(true); // Allow other variables

// Use Joi to validate process.env
const { value: envVars, error } = envSchema.validate(process.env, {
  abortEarly: false, // Report all validation errors
  allowUnknown: true, // Allow extra environment variables
  stripUnknown: true, // Remove unknown variables from the result
});

// If process.env invalid, quit
if (error) {
  console.error("❌ Invalid environment variables:", error.message);
  process.exit(1);
}

// Export validated process.env for codebase to use
export const env = {
  apiPrefix: envVars.API_PREFIX,
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV as "development" | "production" | "test",
  postgres: {
    containerUrl: envVars.DATABASE_URL,
  },
};

import winston from "winston";
import { env } from "@/config/env";
import { NODE_ENVS } from "@/constants/env";

// This file defines Winston logger

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Silent when in node env ci
const isSilent = env.nodeEnv === NODE_ENVS.CI;

// Dynamic format based on node env
const logFormat =
  env.nodeEnv === NODE_ENVS.PRODUCTION
    ? combine(timestamp(), json())
    : combine(timestamp(), colorize(), customFormat);

export const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [new winston.transports.Console({ silent: isSilent })],
  silent: isSilent, // Double shut up just in case
});

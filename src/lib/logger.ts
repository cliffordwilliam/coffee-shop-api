// src/lib/logger.ts
import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp(), colorize(), customFormat),
  transports: [new winston.transports.Console()],
});

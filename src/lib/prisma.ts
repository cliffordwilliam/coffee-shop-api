import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env";
import { NODE_ENVS } from "@/constants/env";
import { logger } from "@/lib/logger";

// Prepare development singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Determine if we reuse an existing instance or create a new one
const isDev = env.nodeEnv !== NODE_ENVS.PRODUCTION;

if (isDev && globalForPrisma.prisma) {
  logger.info("Reusing existing Prisma client instance (dev singleton)");
}

// Set original with new instance or reuse development singleton
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (!globalForPrisma.prisma) {
  logger.info("Created new Prisma client instance");
}

// Update development singleton with original
if (isDev) {
  globalForPrisma.prisma = prisma;
  logger.info(
    `Prisma client assigned to global singleton (env: ${env.nodeEnv})`,
  );
}

import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env";

// Prepare development singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Set original with new instance or reuse development singleton
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Update development singleton with original
if (env.nodeEnv !== "production") {
  globalForPrisma.prisma = prisma;
}

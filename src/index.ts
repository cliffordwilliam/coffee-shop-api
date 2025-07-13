import { env } from "./config/env";
import express from "express";
import coffeeRoutes from "./modules/coffee/coffee.route";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";
import { logger } from "./lib/logger";
import { NODE_ENVS } from "@/constants/env";

const app = express();

// Allow all origins
app.use(cors());

// Parse JSON payload input into req.body
app.use(express.json());

// Swagger docs (skip in test)
if (env.nodeEnv !== NODE_ENVS.TEST) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(
    `📘 Swagger UI available at ${env.protocol}://${env.localhost}:${env.port}/api-docs`,
  );
}

// Modules
const apiRouter = express.Router();
apiRouter.use("/coffees", coffeeRoutes);

// Prefix
app.use(env.apiPrefix, apiRouter);

// Catch all thrown error
app.use(errorHandler);

// Health check
app.get("/healthz", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start HTTP server
app.listen(env.port, "0.0.0.0", () => {
  logger.info(
    `Server running on ${env.protocol}://${env.localhost}:${env.port}${env.apiPrefix}`,
  );
});

// Also handle fatal errors
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection:", reason);
  process.exit(1);
});

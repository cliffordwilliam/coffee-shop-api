import { env } from "./config/env";
import express from "express";
import coffeeRoutes from "./modules/coffee/coffee.route";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";
import { logger } from "./lib/logger";

const app = express();
const PORT = env.port;

// Allow all origins
app.use(cors());

// Parse JSON payload input into req.body
app.use(express.json());

// Swagger docs (skip in test)
if (process.env.NODE_ENV !== "test") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  logger.info(`📘 Swagger UI available at http://localhost:${PORT}/api-docs`);
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
app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on http://localhost:${PORT}${env.apiPrefix}`);
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

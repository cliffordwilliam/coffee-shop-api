import { env } from "./config/env";
import express from "express";
import coffeeRoutes from "./modules/coffee/coffee.route";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

const app = express();
const PORT = env.port;

// Allow all origins
app.use(cors());

// Parse JSON payload input into req.body
app.use(express.json());

// Modules
const apiRouter = express.Router();
apiRouter.use("/coffee", coffeeRoutes);

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
  console.log(`Server running on http://localhost:${PORT}${env.apiPrefix}`);
});

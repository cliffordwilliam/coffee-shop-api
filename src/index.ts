import { env } from "./config/env";
import express from "express";
import coffeeRoutes from "./modules/coffee/coffee.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const PORT = env.port;

// Parse JSON payload input into req.body
app.use(express.json());

// Modules
const apiRouter = express.Router();
apiRouter.use("/coffee", coffeeRoutes);

// Prefix
app.use(env.apiPrefix, apiRouter);

// Catch all thrown error
app.use(errorHandler);

// Start HTTP server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}${env.apiPrefix}`);
});

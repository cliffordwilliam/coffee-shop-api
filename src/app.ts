import express from "express";
import coffeeRouter from "./routes/coffee.routes";

const app = express();

app.use(express.json());

app.get("/api/health-check", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/coffees", coffeeRouter);

export default app;

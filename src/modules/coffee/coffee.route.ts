import { Router } from "express";
import * as coffeeController from "./coffee.controller";
import { validateBody, validateParams } from "@/middlewares/validate";
import { CreateCoffeeSchema, UpdateCoffeeSchema } from "./coffee.schema";
import { IdParamSchema } from "../common/common.schema";

// This file defines route to handler binds, and also validates input payload

const router = Router();

// Handle GET all
router.get("/", coffeeController.getAll);

// Handle GET one
router.get("/:id", validateParams(IdParamSchema), coffeeController.getById);

// Handle POST
router.post("/", validateBody(CreateCoffeeSchema), coffeeController.create);

// Handle PATCH
router.patch(
  "/:id",
  validateParams(IdParamSchema),
  validateBody(UpdateCoffeeSchema),
  coffeeController.update,
);

// Handle DELETE
router.delete("/:id", validateParams(IdParamSchema), coffeeController.remove);

export default router;

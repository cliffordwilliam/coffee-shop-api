// src/modules/coffee/coffee.route.ts

import { Router } from "express";
import * as coffeeController from "./coffee.controller";
import { validateBody, validateParams } from "@/middlewares/validate";
import {
  CreateCoffeeSchema,
  UpdateCoffeeSchema,
  CoffeeIdParamSchema,
} from "./coffee.schema";

const router = Router();

// Handle GET all
router.get("/", coffeeController.getAll);

// Handle GET one
router.get(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  coffeeController.getById,
);

// Handle POST
router.post("/", validateBody(CreateCoffeeSchema), coffeeController.create);

// Handle PUT
router.put(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  validateBody(UpdateCoffeeSchema),
  coffeeController.update,
);

// Handle DELETE
router.delete(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  coffeeController.remove,
);

export default router;

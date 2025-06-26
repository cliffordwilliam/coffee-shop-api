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

router.get("/", coffeeController.getAll);
router.get(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  coffeeController.getById,
);
router.post("/", validateBody(CreateCoffeeSchema), coffeeController.create);
router.put(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  validateBody(UpdateCoffeeSchema),
  coffeeController.update,
);
router.delete(
  "/:id",
  validateParams(CoffeeIdParamSchema),
  coffeeController.remove,
);

export default router;

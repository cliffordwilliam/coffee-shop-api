// src/modules/coffee/coffee.route.ts

import { Router } from "express";
import * as coffeeController from "./coffee.controller";
import { validate } from "@/middlewares/validate";
import { CreateCoffeeSchema, UpdateCoffeeSchema } from "./coffee.model";

const router = Router();

router.get("/", coffeeController.getAll);
router.get("/:id", coffeeController.getById);
router.post("/", validate(CreateCoffeeSchema), coffeeController.create);
router.put("/:id", validate(UpdateCoffeeSchema), coffeeController.update);
router.delete("/:id", coffeeController.remove);

export default router;

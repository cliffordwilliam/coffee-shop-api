import { Router } from "express";
import { getAllCoffees } from "../controllers/coffee.controller";

const router = Router();

router.get("/", getAllCoffees);

export default router;

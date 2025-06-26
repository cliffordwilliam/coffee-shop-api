// src/modules/coffee/coffee.controller.ts
import { Request, Response } from "express";
import * as coffeeService from "./coffee.service";
import { NotFoundError } from "@/modules/api/NotFoundError";
import {
  CreateCoffeeResponseSchema,
  ListCoffeesResponseSchema,
  ViewCoffeeResponseSchema,
} from "./coffee.schema";
import { validateResponse } from "@/utils/validateResponse";

export const getAll = async (_req: Request, res: Response) => {
  const coffees = await coffeeService.getAllCoffees();
  const response = validateResponse(ListCoffeesResponseSchema, {
    success: true,
    data: coffees,
  });
  res.json(response);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const coffee = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const response = validateResponse(ViewCoffeeResponseSchema, {
    success: true,
    data: coffee,
  });
  res.json(response);
};

export const create = async (req: Request, res: Response) => {
  const newCoffee = await coffeeService.createCoffee(req.body);
  const response = validateResponse(CreateCoffeeResponseSchema, {
    success: true,
    data: newCoffee,
  });
  res.status(201).json(response);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await coffeeService.updateCoffee(id, req.body);
    const response = validateResponse(ViewCoffeeResponseSchema, {
      success: true,
      data: updated,
    });
    res.json(response);
  } catch (error) {
    throw new NotFoundError("Coffee not found");
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await coffeeService.deleteCoffee(id);
    // No schema needed here—simple response
    res.status(200).json({ success: true });
  } catch (error) {
    throw new NotFoundError("Coffee not found");
  }
};

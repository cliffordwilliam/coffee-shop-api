// src/modules/coffee/coffee.controller.ts

import { Request, Response } from "express";
import * as coffeeService from "./coffee.service";
import type { SuccessResponse } from "@/modules/api/types";
import { NotFoundError } from "@/modules/api/NotFoundError";

export const getAll = async (_req: Request, res: Response) => {
  const coffees = await coffeeService.getAllCoffees();
  // Send my success response shape
  const response: SuccessResponse<typeof coffees> = {
    success: true,
    data: coffees,
  };
  res.json(response);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const coffee = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    // Throw my error entity obj (NOT FOUND)
    throw new NotFoundError("Coffee not found");
  }
  // Send my success response shape
  const response: SuccessResponse<typeof coffee> = {
    success: true,
    data: coffee,
  };
  res.json(response);
};

export const create = async (req: Request, res: Response) => {
  const newCoffee = await coffeeService.createCoffee(req.body);
  // Send my success response shape
  const response: SuccessResponse<typeof newCoffee> = {
    success: true,
    data: newCoffee,
  };
  res.status(201).json(response);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await coffeeService.updateCoffee(id, req.body);
    // Send my success response shape
    const response: SuccessResponse<typeof updated> = {
      success: true,
      data: updated,
    };
    res.json(response);
  } catch (error) {
    // Throw my error entity obj (NOT FOUND)
    throw new NotFoundError("Coffee not found");
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await coffeeService.deleteCoffee(id);
    res.status(200).json({ success: true });
  } catch (error) {
    // Throw my error entity obj (NOT FOUND)
    throw new NotFoundError("Coffee not found");
  }
};

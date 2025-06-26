// src/modules/coffee/coffee.controller.ts
import { Request, Response, RequestHandler } from "express";
import * as coffeeService from "./coffee.service";
import { NotFoundError } from "@/modules/api/NotFoundError";
import {
  CoffeeIdParams,
  CreateCoffeeRequest,
  CreateCoffeeResponse,
  CreateCoffeeResponseSchema,
  ListCoffeesResponse,
  ListCoffeesResponseSchema,
  UpdateCoffeeRequest,
  UpdateCoffeeResponse,
  ViewCoffeeResponse,
  ViewCoffeeResponseSchema,
} from "./coffee.schema";
import { validateResponse } from "@/utils/validateResponse";

export const getAll = async (_req: Request, res: Response) => {
  const coffees = await coffeeService.getAllCoffees();
  const response = validateResponse(ListCoffeesResponseSchema, {
    success: true,
    data: coffees,
  });
  res.json(response satisfies ListCoffeesResponse);
};

export const getById: RequestHandler<CoffeeIdParams, any, any> = async (
  req,
  res,
) => {
  const id = req.params.id;
  const coffee = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const response = validateResponse(ViewCoffeeResponseSchema, {
    success: true,
    data: coffee,
  });
  res.json(response satisfies ViewCoffeeResponse);
};

export const create: RequestHandler<{}, any, CreateCoffeeRequest> = async (
  req,
  res,
) => {
  const newCoffee = await coffeeService.createCoffee(req.body);
  const response = validateResponse(CreateCoffeeResponseSchema, {
    success: true,
    data: newCoffee,
  });
  res.status(201).json(response satisfies CreateCoffeeResponse);
};

export const update: RequestHandler<
  CoffeeIdParams,
  any,
  UpdateCoffeeRequest
> = async (req, res) => {
  const id = req.params.id;
  try {
    const updated = await coffeeService.updateCoffee(id, req.body);
    const response = validateResponse(ViewCoffeeResponseSchema, {
      success: true,
      data: updated,
    });
    res.json(response satisfies UpdateCoffeeResponse);
  } catch (error) {
    throw new NotFoundError("Coffee not found");
  }
};

export const remove: RequestHandler<CoffeeIdParams, any, any> = async (
  req,
  res,
) => {
  const id = req.params.id;
  try {
    await coffeeService.deleteCoffee(id);
    // No schema needed here—simple response
    res.status(200).json({ success: true });
  } catch (error) {
    throw new NotFoundError("Coffee not found");
  }
};

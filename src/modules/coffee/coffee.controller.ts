// src/modules/coffee/coffee.controller.ts
import type { Coffee } from "@prisma/client";
import { RequestHandler } from "express";
import * as coffeeService from "./coffee.service";
import { NotFoundError } from "@/modules/api/NotFoundError";
import {
  CoffeeIdParams,
  CreateCoffeeRequest,
  CreateCoffeeResponse,
  CreateCoffeeResponseSchema,
  DeleteCoffeeResponse,
  DeleteCoffeeResponseSchema,
  ListCoffeesResponse,
  ListCoffeesResponseSchema,
  UpdateCoffeeRequest,
  UpdateCoffeeResponse,
  UpdateCoffeeResponseSchema,
  ViewCoffeeResponse,
  ViewCoffeeResponseSchema,
} from "./coffee.schema";
import { validateResponse } from "@/utils/validateResponse";

// Take query string pagination + filter for get all
export const getAll: RequestHandler<{}, ListCoffeesResponse, any> = async (
  _req,
  res,
) => {
  const coffees: Coffee[] = await coffeeService.getAllCoffees();
  const response: ListCoffeesResponse = validateResponse(
    ListCoffeesResponseSchema,
    {
      success: true,
      data: coffees,
    },
  );
  res.status(200).json(response);
};

// Takes in validated coffee param query. Use it with service to get 1 coffee
export const getById: RequestHandler<
  CoffeeIdParams,
  ViewCoffeeResponse,
  any
> = async (req, res) => {
  const id = req.params.id;
  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const response: ViewCoffeeResponse = validateResponse(
    ViewCoffeeResponseSchema,
    {
      success: true,
      data: coffee,
    },
  );
  res.status(200).json(response);
};

// Takes in validated coffee req body payload. Use it with service to make 1 new coffee
export const create: RequestHandler<
  {},
  CreateCoffeeResponse,
  CreateCoffeeRequest
> = async (req, res) => {
  const newCoffee: Coffee = await coffeeService.createCoffee(req.body);
  const response: CreateCoffeeResponse = validateResponse(
    CreateCoffeeResponseSchema,
    {
      success: true,
      data: newCoffee,
    },
  );
  res.status(201).json(response);
};

// Takes in validated coffee req body payload. Use it with service to edit 1 new coffee
export const update: RequestHandler<
  CoffeeIdParams,
  UpdateCoffeeResponse,
  UpdateCoffeeRequest
> = async (req, res) => {
  const id = req.params.id;
  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const updated: Coffee = await coffeeService.updateCoffee(id, req.body);
  const response: UpdateCoffeeResponse = validateResponse(
    UpdateCoffeeResponseSchema,
    {
      success: true,
      data: updated,
    },
  );
  res.status(200).json(response);
};

// Takes in validated coffee param query. Use it with service to delete 1 coffee
export const remove: RequestHandler<
  CoffeeIdParams,
  DeleteCoffeeResponse,
  any
> = async (req, res) => {
  const id = req.params.id;
  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const deletedCoffee: Coffee = await coffeeService.deleteCoffee(id);
  const response: DeleteCoffeeResponse = validateResponse(
    DeleteCoffeeResponseSchema,
    {
      success: true,
      data: deletedCoffee,
    },
  );
  res.status(200).json(response);
};

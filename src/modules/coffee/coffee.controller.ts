import type { Coffee } from "@prisma/client";
import { RequestHandler } from "express";
import * as coffeeService from "./coffee.service";
import { NotFoundError } from "@/modules/api/NotFoundError";
import {
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
import { IdParam } from "../common/common.schema";
import { HTTP_STATUS } from "@/constants/http";

// This file takes in validated input from router, use service to talk to dbms, validate response before sending it back to client

// Get all coffees with prisma
// Use all coffees to make ListCoffeesResponse type shape and validate it before returning it to client
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
  res.status(HTTP_STATUS.OK).json(response);
};

// Path Parameter passed in here is validated
// Get one coffee with prisma
// Use one coffee to make ViewCoffeesResponse type shape and validate it before returning it to client
export const getById: RequestHandler<IdParam, ViewCoffeeResponse, any> = async (
  req,
  res,
) => {
  const coffee: Coffee | null = await coffeeService.getCoffeeById(
    req.params.id,
  );
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
  res.status(HTTP_STATUS.OK).json(response);
};

// Req body payload passed in here is validated
// Make one coffee with prisma
// Use created one coffee to make CreateCoffeeResponse type shape and validate it before returning it to client
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
  res.status(HTTP_STATUS.CREATED).json(response);
};

// Path Parameter passed in here is validated
// Req body payload passed in here is validated
// Patch one coffee with prisma
// Use patched one coffee to make UpdateCoffeeResponse type shape and validate it before returning it to client
export const update: RequestHandler<
  IdParam,
  UpdateCoffeeResponse,
  UpdateCoffeeRequest
> = async (req, res) => {
  const coffee: Coffee | null = await coffeeService.getCoffeeById(
    req.params.id,
  );
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const updated: Coffee = await coffeeService.updateCoffee(
    req.params.id,
    req.body,
  );
  const response: UpdateCoffeeResponse = validateResponse(
    UpdateCoffeeResponseSchema,
    {
      success: true,
      data: updated,
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

// Path Parameter passed in here is validated
// Delete one coffee with prisma
// Use deleted one coffee to make DeleteCoffeeResponse type shape and validate it before returning it to client
export const remove: RequestHandler<
  IdParam,
  DeleteCoffeeResponse,
  any
> = async (req, res) => {
  const coffee: Coffee | null = await coffeeService.getCoffeeById(
    req.params.id,
  );
  if (!coffee) {
    throw new NotFoundError("Coffee not found");
  }
  const deletedCoffee: Coffee = await coffeeService.deleteCoffee(req.params.id);
  const response: DeleteCoffeeResponse = validateResponse(
    DeleteCoffeeResponseSchema,
    {
      success: true,
      data: deletedCoffee,
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

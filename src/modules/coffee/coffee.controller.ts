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
import { IdParam, PaginationQuery } from "../common/common.schema";
import { HTTP_STATUS } from "@/constants/http";
import { ValidatedRequest } from "@/middlewares/validate";
import { logger } from "@/lib/logger";

// This file takes in validated input from router, use service to talk to dbms, validate response before sending it back to client

export const getAll: RequestHandler<
  Record<string, never>, // Params
  ListCoffeesResponse, // Response body
  unknown, // Request body (unused)
  unknown // Query
> = async (req, res) => {
  const { page, limit } = (req as unknown as ValidatedRequest<PaginationQuery>)
    .validatedQuery;

  logger.info(`Request: Get all coffees (page=${page}, limit=${limit})`);

  const [total, coffees]: [number, Coffee[]] =
    await coffeeService.getAllCoffees(page, limit);

  logger.info(`Found ${coffees.length} coffees out of total ${total}`);

  const response: ListCoffeesResponse = validateResponse(
    ListCoffeesResponseSchema,
    {
      success: true,
      data: coffees,
      meta: {
        pagination: {
          page,
          size: limit,
          total,
        },
      },
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

export const getById: RequestHandler<
  IdParam,
  ViewCoffeeResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  logger.info(`Request: Get coffee by id (${id})`);

  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    logger.warn(`Coffee with id ${id} not found`);
    throw new NotFoundError("Coffee not found");
  }

  logger.info(`Found coffee with id ${id}`);

  const response: ViewCoffeeResponse = validateResponse(
    ViewCoffeeResponseSchema,
    {
      success: true,
      data: coffee,
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

export const create: RequestHandler<
  Record<string, never>,
  CreateCoffeeResponse,
  CreateCoffeeRequest
> = async (req, res) => {
  logger.info(
    `Request: Create new coffee with data: ${JSON.stringify(req.body)}`,
  );

  const newCoffee: Coffee = await coffeeService.createCoffee(req.body);

  logger.info(`Created coffee with id ${newCoffee.id}`);

  const response: CreateCoffeeResponse = validateResponse(
    CreateCoffeeResponseSchema,
    {
      success: true,
      data: newCoffee,
    },
  );
  res.status(HTTP_STATUS.CREATED).json(response);
};

export const update: RequestHandler<
  IdParam,
  UpdateCoffeeResponse,
  UpdateCoffeeRequest
> = async (req, res) => {
  const { id } = req.params;
  logger.info(`Request: Update coffee with id ${id}`);

  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    logger.warn(`Coffee with id ${id} not found for update`);
    throw new NotFoundError("Coffee not found");
  }

  const updated: Coffee = await coffeeService.updateCoffee(id, req.body);

  logger.info(`Updated coffee with id ${id}`);

  const response: UpdateCoffeeResponse = validateResponse(
    UpdateCoffeeResponseSchema,
    {
      success: true,
      data: updated,
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

export const remove: RequestHandler<
  IdParam,
  DeleteCoffeeResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;
  logger.info(`Request: Delete coffee with id ${id}`);

  const coffee: Coffee | null = await coffeeService.getCoffeeById(id);
  if (!coffee) {
    logger.warn(`Coffee with id ${id} not found for deletion`);
    throw new NotFoundError("Coffee not found");
  }

  const deletedCoffee: Coffee = await coffeeService.deleteCoffee(id);

  logger.info(`Deleted coffee with id ${id}`);

  const response: DeleteCoffeeResponse = validateResponse(
    DeleteCoffeeResponseSchema,
    {
      success: true,
      data: deletedCoffee,
    },
  );
  res.status(HTTP_STATUS.OK).json(response);
};

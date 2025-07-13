import { prisma } from "@/lib/prisma";
import { CreateCoffeeRequest, UpdateCoffeeRequest } from "./coffee.schema";
import { logger } from "@/lib/logger";

// This file uses prisma to get data

// Use prisma to find many
export const getAllCoffees = async (page: number, limit: number) => {
  logger.info(`Fetching all coffees - page: ${page}, limit: ${limit}`);
  return await prisma.$transaction([
    prisma.coffee.count(),
    prisma.coffee.findMany({
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
};

// Use prisma to find one
export const getCoffeeById = async (id: number) => {
  logger.info(`Fetching coffee with id: ${id}`);
  return await prisma.coffee.findUnique({ where: { id } });
};

// Use prisma to create
export const createCoffee = async (data: CreateCoffeeRequest) => {
  logger.info(`Creating new coffee: ${data.name}`);
  return await prisma.coffee.create({ data });
};

// Use prisma to patch
export const updateCoffee = async (id: number, data: UpdateCoffeeRequest) => {
  logger.info(`Updating coffee with id: ${id}`);
  return await prisma.coffee.update({
    where: { id },
    data,
  });
};

// Use prisma to delete one
export const deleteCoffee = async (id: number) => {
  logger.info(`Deleting coffee with id: ${id}`);
  return await prisma.coffee.delete({ where: { id } });
};

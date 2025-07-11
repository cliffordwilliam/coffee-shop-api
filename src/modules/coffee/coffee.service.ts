import { prisma } from "@/lib/prisma";
import { CreateCoffeeRequest, UpdateCoffeeRequest } from "./coffee.schema";

// This file uses prisma to get data

// Use prisma to find many
export const getAllCoffees = async (page: number, limit: number) => {
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
  return await prisma.coffee.findUnique({ where: { id } });
};

// Use prisma to create
export const createCoffee = async (data: CreateCoffeeRequest) => {
  return await prisma.coffee.create({ data });
};

// Use prisma to patch
export const updateCoffee = async (id: number, data: UpdateCoffeeRequest) => {
  return await prisma.coffee.update({
    where: { id },
    data,
  });
};

// Use prisma to delete one
export const deleteCoffee = async (id: number) => {
  return await prisma.coffee.delete({ where: { id } });
};

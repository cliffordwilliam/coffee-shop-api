// src/modules/coffee/coffee.service.ts

import { prisma } from "@/lib/prisma";
import { CreateCoffeeRequest, UpdateCoffeeRequest } from "./coffee.schema";

export const getAllCoffees = () => {
  return prisma.coffee.findMany();
};

export const getCoffeeById = (id: number) => {
  return prisma.coffee.findUnique({ where: { id } });
};

export const createCoffee = (data: CreateCoffeeRequest) => {
  return prisma.coffee.create({ data });
};

export const updateCoffee = (id: number, data: UpdateCoffeeRequest) => {
  return prisma.coffee.update({
    where: { id },
    data,
  });
};

export const deleteCoffee = (id: number) => {
  return prisma.coffee.delete({ where: { id } });
};

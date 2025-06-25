// src/modules/coffee/coffee.service.ts

import { PrismaClient } from '@prisma/client';
import { CreateCoffeeDTO, UpdateCoffeeDTO } from './coffee.model';

const prisma = new PrismaClient();

export const getAllCoffees = () => {
  return prisma.coffee.findMany();
};

export const getCoffeeById = (id: number) => {
  return prisma.coffee.findUnique({ where: { id } });
};

export const createCoffee = (data: CreateCoffeeDTO) => {
  return prisma.coffee.create({ data });
};

export const updateCoffee = (id: number, data: UpdateCoffeeDTO) => {
  return prisma.coffee.update({
    where: { id },
    data,
  });
};

export const deleteCoffee = (id: number) => {
  return prisma.coffee.delete({ where: { id } });
};

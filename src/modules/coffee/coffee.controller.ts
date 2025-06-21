// src/modules/coffee/coffee.controller.ts

import { Request, Response } from 'express';
import * as coffeeService from './coffee.service';

export const getAll = async (_req: Request, res: Response) => {
  const coffees = await coffeeService.getAllCoffees();
  res.json(coffees);
};

export const getById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const coffee = await coffeeService.getCoffeeById(id);
    res.json(coffee);
  } catch (error) {
    res.status(404).json({ message: 'Coffee not found' });
  }
};

export const create = async (req: Request, res: Response) => {
  const newCoffee = await coffeeService.createCoffee(req.body);
  res.status(201).json(newCoffee);
};

export const update = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const updated = await coffeeService.updateCoffee(id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: 'Coffee not found' });
  }
};

export const remove = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await coffeeService.deleteCoffee(id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: 'Coffee not found' });
  }
};

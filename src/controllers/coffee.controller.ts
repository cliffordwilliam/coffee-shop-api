import { Request, Response } from "express";
import prisma from "../prisma/client";

export const getAllCoffees = async (req: Request, res: Response) => {
  try {
    const coffees = await prisma.coffee.findMany();
    res.json(coffees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch coffees." });
  }
};

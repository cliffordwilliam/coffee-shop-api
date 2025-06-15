import { PrismaClient } from "../generated/prisma";
import express from "express";

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/coffees", async (req, res) => {
  try {
    const coffees = await prisma.coffee.findMany();
    res.json(coffees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

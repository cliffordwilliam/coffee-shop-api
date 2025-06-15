import { faker } from "@faker-js/faker";
import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();
async function main() {
  const coffees = Array.from({ length: 10 }).map(() => ({
    name: faker.commerce.productName() + " Coffee",
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price({ min: 2, max: 10 })),
  }));
  await prisma.coffee.createMany({ data: coffees });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

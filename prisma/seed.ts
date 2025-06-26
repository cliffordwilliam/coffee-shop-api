import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const coffeeData = [
    {
      name: "Espresso",
      description: "Strong and bold shot of pure coffee.",
      price: 2.5,
    },
    {
      name: "Latte",
      description: "Espresso with steamed milk and a layer of foam.",
      price: 2.5,
    },
    {
      name: "Cappuccino",
      description: "Rich espresso with frothy milk foam.",
      price: 2.5,
    },
    {
      name: "Cold Brew",
      description: "Smooth, cold-steeped coffee over ice.",
      price: 2.5,
    },
  ];
  const coffees = await Promise.all(
    coffeeData.map((coffee) =>
      prisma.coffee.create({
        data: coffee,
      }),
    ),
  );
  console.log(`🌱 Seeded ${coffees.length} coffees:`);
  coffees.forEach((coffee) =>
    console.log(`☕️ ${coffee.name} ($${coffee.price})`),
  );
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

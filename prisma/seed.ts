import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { logger } from "@/lib/logger";

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
  logger.info(`✅ Seeded ${coffees.length} coffees`);
  coffees.forEach((coffee) =>
    logger.info(`☕️ ${coffee.name} ($${coffee.price})`),
  );
}
main()
  .then(async () => {
    logger.info("🌱 Seeding completed. Disconnecting Prisma.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    logger.error("❌ Error during seeding", { error: e });
    await prisma.$disconnect();
    process.exit(1);
  });

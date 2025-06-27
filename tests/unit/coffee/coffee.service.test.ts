import { createCoffee } from "@/modules/coffee/coffee.service";
import { prisma } from "@/lib/prisma";
import { CreateCoffeeRequest } from "@/modules/coffee/coffee.schema";
import type { Coffee } from "@prisma/client";

// This file tests coffee.service.ts funcs

// Mock fake prisma client (here we just need fake prisma.coffee.create)
jest.mock("@/lib/prisma", () => ({
  prisma: {
    coffee: {
      create: jest.fn(),
    },
  },
}));

describe("createCoffee", () => {
  it("creates a coffee and returns it", async () => {
    // Make fakeCreateCoffeeRequest
    const fakeCreateCoffeeRequest: CreateCoffeeRequest = {
      name: "Latte",
      price: 45000,
    };
    // Make fakeCoffee
    const fakeCoffee: Coffee = {
      id: 1,
      name: "Espresso",
      description: "Strong and bold shot of pure coffee.",
      price: 2.5,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-01T00:00:00Z"),
    };
    // Set fake prisma.coffee.create output with fakeCoffee
    (prisma.coffee.create as jest.Mock).mockResolvedValue(fakeCoffee);
    // Call real createCoffee with fakes
    const result = await createCoffee(fakeCreateCoffeeRequest);
    // Begin the test
    expect(prisma.coffee.create).toHaveBeenCalledWith({
      data: fakeCreateCoffeeRequest,
    });
    expect(result).toEqual(fakeCoffee);
  });
});

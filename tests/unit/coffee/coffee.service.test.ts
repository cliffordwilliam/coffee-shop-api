import {
  createCoffee,
  getAllCoffees,
  getCoffeeById,
  updateCoffee,
  deleteCoffee,
} from "@/modules/coffee/coffee.service";
import { prisma } from "@/lib/prisma";
import {
  CreateCoffeeRequest,
  UpdateCoffeeRequest,
} from "@/modules/coffee/coffee.schema";
import type { Coffee } from "@prisma/client";
import { Prisma } from "@prisma/client";

// This file tests coffee.service.ts funcs

// Clear all mocks, ensure isolation each time
// When using jest.mock(), it has call history that persists between tests like toHaveBeenCalledTimes
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock fake prisma.coffee
jest.mock("@/lib/prisma", () => ({
  prisma: {
    coffee: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Make fakeNonExistingCoffeeId
const fakeNonExistingCoffeeId: number = -1;

// Make fakeExistingCoffeeId
const fakeExistingCoffeeId: number = 1;

// Make fakeCoffee
const fakeCoffee: Coffee = {
  id: fakeExistingCoffeeId,
  name: "Espresso",
  description: "Strong and bold shot of pure coffee.",
  price: 2.5,
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

const fakePartialCoffee: Coffee = {
  id: fakeExistingCoffeeId,
  name: "Espresso",
  description: null,
  price: 2.5,
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

// Make fakeCreateCoffeeRequest
const fakeCreateCoffeeRequest: CreateCoffeeRequest = {
  name: "Espresso",
  description: "Strong and bold shot of pure coffee.",
  price: 2.5,
};

// Make fakePartialCreateCoffeeRequest
const fakePartialCreateCoffeeRequest: CreateCoffeeRequest = {
  name: "Espresso",
  price: 2.5,
};

// Make fakeUpdateCoffeeRequest
const fakeUpdateCoffeeRequest: UpdateCoffeeRequest = {
  name: "Latte Updated",
  price: 99999,
};

// Make fakePartialUpdateCoffeeRequest
const fakePartialUpdateCoffeeRequest: UpdateCoffeeRequest = {
  name: "Latte Updated",
};

// Make fakeUpdatedCoffee
const fakeUpdatedCoffee: Coffee = {
  id: fakeCoffee.id,
  name: fakeUpdateCoffeeRequest.name!,
  description: fakeCoffee.description,
  price: fakeUpdateCoffeeRequest.price!,
  createdAt: fakeCoffee.createdAt,
  updatedAt: new Date("2023-02-01T00:00:00Z"),
};

// Make fakePartialUpdatedCoffee
const fakePartialUpdatedCoffee: Coffee = {
  id: fakeCoffee.id,
  name: fakeUpdateCoffeeRequest.name!,
  description: fakeCoffee.description,
  price: fakeCoffee.price,
  createdAt: fakeCoffee.createdAt,
  updatedAt: new Date("2023-02-01T00:00:00Z"),
};

// Make fake db error
const fakeError = new Error("Database failure");

// Make prisma not found error
const notFoundError = new Prisma.PrismaClientKnownRequestError(
  "Record not found",
  {
    code: "P2025",
    clientVersion: Prisma.prismaVersion.client,
    meta: undefined,
    batchRequestIdx: undefined,
  },
);

describe("coffee.service", () => {
  describe("getAllCoffees", () => {
    describe.each([
      {
        result: [fakeCoffee],
        expected: [fakeCoffee],
        label: "returns a list of coffees",
      },
      { result: [], expected: [], label: "returns an empty list of coffees" },
    ])("$label", ({ result, expected }) => {
      it("works correctly", async () => {
        // Set fake prisma.coffee output
        (prisma.coffee.findMany as jest.Mock).mockResolvedValue(result);
        // Call real service with fakes
        const data = await getAllCoffees();
        // Begin the test
        expect(prisma.coffee.findMany).toHaveBeenCalled();
        expect(data).toEqual(expected);
      });
    });
    it("throws an error if prisma.coffee.findMany fails", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.findMany as jest.Mock).mockRejectedValue(fakeError);
      // Call real service with fakes
      await expect(getAllCoffees()).rejects.toThrow("Database failure");
    });
  });

  describe("getCoffeeById", () => {
    it("returns a coffee when data exists", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.findUnique as jest.Mock).mockResolvedValue(fakeCoffee);
      // Call real service with fakes
      const result = await getCoffeeById(fakeExistingCoffeeId);
      // Begin the test
      expect(prisma.coffee.findUnique).toHaveBeenCalledWith({
        where: { id: fakeExistingCoffeeId },
      });
      expect(result).toMatchObject({
        id: fakeCoffee.id,
        name: fakeCoffee.name,
        description: fakeCoffee.description,
        price: fakeCoffee.price,
        createdAt: fakeCoffee.createdAt,
        updatedAt: fakeCoffee.updatedAt,
      });
    });
    it("returns null when data does not exist", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.findUnique as jest.Mock).mockResolvedValue(null);
      // Call real service with fakes
      const result = await getCoffeeById(fakeNonExistingCoffeeId);
      // Begin the test
      expect(prisma.coffee.findUnique).toHaveBeenCalledWith({
        where: { id: fakeNonExistingCoffeeId },
      });
      expect(result).toEqual(null);
    });
    it("throws an error if prisma.coffee.findUnique fails", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.findUnique as jest.Mock).mockRejectedValue(fakeError);
      // Call real service with fakes
      await expect(getCoffeeById(fakeExistingCoffeeId)).rejects.toThrow(
        "Database failure",
      );
    });
  });

  describe("createCoffee", () => {
    it("creates a coffee and returns it", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.create as jest.Mock).mockResolvedValue(fakeCoffee);
      // Call real service with fakes
      const result = await createCoffee(fakeCreateCoffeeRequest);
      // Begin the test
      expect(prisma.coffee.create).toHaveBeenCalledWith({
        data: fakeCreateCoffeeRequest,
      });
      expect(result).toMatchObject({
        id: fakeCoffee.id,
        name: fakeCoffee.name,
        description: fakeCoffee.description,
        price: fakeCoffee.price,
        createdAt: fakeCoffee.createdAt,
        updatedAt: fakeCoffee.updatedAt,
      });
    });
    it("partial creates a coffee and returns it", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.create as jest.Mock).mockResolvedValue(fakePartialCoffee);
      // Call real service with fakes
      const result = await createCoffee(fakePartialCreateCoffeeRequest);
      // Begin the test
      expect(prisma.coffee.create).toHaveBeenCalledWith({
        data: fakePartialCreateCoffeeRequest,
      });
      expect(result).toMatchObject({
        id: fakePartialCoffee.id,
        name: fakePartialCoffee.name,
        description: fakePartialCoffee.description,
        price: fakePartialCoffee.price,
        createdAt: fakePartialCoffee.createdAt,
        updatedAt: fakePartialCoffee.updatedAt,
      });
    });
    it("throws an error if prisma.coffee.create fails", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.create as jest.Mock).mockRejectedValue(fakeError);
      // Call real service with fakes
      await expect(createCoffee(fakeCreateCoffeeRequest)).rejects.toThrow(
        "Database failure",
      );
    });
  });

  describe("updateCoffee", () => {
    it("updates a coffee and returns it", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.update as jest.Mock).mockResolvedValue(fakeUpdatedCoffee);
      // Call real service with fakes
      const result = await updateCoffee(
        fakeExistingCoffeeId,
        fakeUpdateCoffeeRequest,
      );
      // Begin the test
      expect(prisma.coffee.update).toHaveBeenCalledWith({
        data: fakeUpdateCoffeeRequest,
        where: { id: fakeExistingCoffeeId },
      });
      expect(result).toMatchObject({
        id: fakeCoffee.id,
        name: fakeUpdatedCoffee.name,
        description: fakeCoffee.description,
        price: fakeUpdatedCoffee.price,
        createdAt: fakeCoffee.createdAt,
        updatedAt: fakeUpdatedCoffee.updatedAt,
      });
      expect(fakeUpdatedCoffee.updatedAt).toBeInstanceOf(Date);
      expect(fakeUpdatedCoffee.updatedAt.getTime()).toBeGreaterThan(
        fakeCoffee.updatedAt.getTime(),
      );
    });
    it("partial updates a coffee and returns it", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.update as jest.Mock).mockResolvedValue(
        fakePartialUpdatedCoffee,
      );
      // Call real service with fakes
      const result = await updateCoffee(
        fakeExistingCoffeeId,
        fakePartialUpdateCoffeeRequest,
      );
      // Begin the test
      expect(prisma.coffee.update).toHaveBeenCalledWith({
        data: fakePartialUpdateCoffeeRequest,
        where: { id: fakeExistingCoffeeId },
      });
      expect(result).toMatchObject({
        id: fakeCoffee.id,
        name: fakePartialUpdateCoffeeRequest.name,
        description: fakeCoffee.description,
        price: fakeCoffee.price,
        createdAt: fakeCoffee.createdAt,
        updatedAt: fakePartialUpdatedCoffee.updatedAt,
      });
      expect(fakePartialUpdatedCoffee.updatedAt).toBeInstanceOf(Date);
      expect(fakePartialUpdatedCoffee.updatedAt.getTime()).toBeGreaterThan(
        fakeCoffee.updatedAt.getTime(),
      );
    });
    it("throws an error if coffee does not exist when updating", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.update as jest.Mock).mockRejectedValue(notFoundError);
      // Call real service with fakes
      await expect(
        updateCoffee(fakeNonExistingCoffeeId, fakeUpdateCoffeeRequest),
      ).rejects.toThrow(expect.objectContaining({ code: "P2025" }));
    });
    it("throws an error if prisma.coffee.update fails", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.update as jest.Mock).mockRejectedValue(fakeError);
      // Call real service with fakes
      await expect(
        updateCoffee(fakeExistingCoffeeId, fakeUpdateCoffeeRequest),
      ).rejects.toThrow("Database failure");
    });
  });

  describe("deleteCoffee", () => {
    it("returns a coffee when data deleted", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.delete as jest.Mock).mockResolvedValue(fakeCoffee);
      // Call real service with fakes
      const result = await deleteCoffee(fakeExistingCoffeeId);
      // Begin the test
      expect(prisma.coffee.delete).toHaveBeenCalledWith({
        where: { id: fakeExistingCoffeeId },
      });
      expect(result).toMatchObject({
        id: fakeCoffee.id,
        name: fakeCoffee.name,
        description: fakeCoffee.description,
        price: fakeCoffee.price,
        createdAt: fakeCoffee.createdAt,
        updatedAt: fakeCoffee.updatedAt,
      });
    });
    it("throws an error if coffee does not exist when deleting", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.delete as jest.Mock).mockRejectedValue(notFoundError);
      // Call real service with fakes
      await expect(deleteCoffee(fakeNonExistingCoffeeId)).rejects.toThrow(
        expect.objectContaining({ code: "P2025" }),
      );
    });
    it("throws an error if prisma.coffee.delete fails", async () => {
      // Set fake prisma.coffee output
      (prisma.coffee.delete as jest.Mock).mockRejectedValue(fakeError);
      // Call real service with fakes
      await expect(deleteCoffee(fakeExistingCoffeeId)).rejects.toThrow(
        "Database failure",
      );
    });
  });
});

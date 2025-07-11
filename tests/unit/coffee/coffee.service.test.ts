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
    $transaction: jest.fn(),
    coffee: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

// Dates
const baseDate = new Date("2023-01-01T00:00:00Z");
const updatedDate = new Date("2023-02-01T00:00:00Z");

// IDs
const fakeNonExistingCoffeeId: number = -1;
const fakeExistingCoffeeId: number = 1;

// Responses
const baseCoffee: Coffee = {
  id: fakeExistingCoffeeId,
  name: "Espresso",
  description: "Strong and bold shot of pure coffee.",
  price: 2.5,
  createdAt: baseDate,
  updatedAt: baseDate,
};

const fakeCoffee: Coffee = { ...baseCoffee };

const fakePartialCoffee: Coffee = {
  ...baseCoffee,
  description: null,
};

// Requests
const fakeCreateCoffeeRequest: CreateCoffeeRequest = {
  name: baseCoffee.name,
  description: baseCoffee.description!,
  price: baseCoffee.price,
};

const fakePartialCreateCoffeeRequest: CreateCoffeeRequest = {
  name: baseCoffee.name,
  price: baseCoffee.price,
};

const fakeUpdateCoffeeRequest: UpdateCoffeeRequest = {
  name: "Latte Updated",
  price: 99999,
};

const fakePartialUpdateCoffeeRequest: UpdateCoffeeRequest = {
  name: fakeUpdateCoffeeRequest.name,
};

const fakeUpdatedCoffee: Coffee = {
  ...baseCoffee,
  name: fakeUpdateCoffeeRequest.name!,
  price: fakeUpdateCoffeeRequest.price!,
  updatedAt: updatedDate,
};

const fakePartialUpdatedCoffee: Coffee = {
  ...baseCoffee,
  name: fakeUpdateCoffeeRequest.name!,
  updatedAt: updatedDate,
};

// Errors
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
    const page = 1;
    const limit = 10;

    describe.each([
      {
        transactionResult: [1, [fakeCoffee]],
        expected: [1, [fakeCoffee]],
        label: "returns a list of coffees with total count",
      },
      {
        transactionResult: [0, []],
        expected: [0, []],
        label: "returns an empty list of coffees with zero count",
      },
    ])("$label", ({ transactionResult, expected }) => {
      it("works correctly", async () => {
        (prisma.$transaction as jest.Mock).mockResolvedValue(transactionResult);
        const result = await getAllCoffees(page, limit);

        expect(prisma.$transaction).toHaveBeenCalledWith([
          prisma.coffee.count(),
          prisma.coffee.findMany({
            skip: (page - 1) * limit,
            take: limit,
          }),
        ]);
        expect(result).toEqual(expected);
      });
    });

    it("throws an error if transaction fails", async () => {
      (prisma.$transaction as jest.Mock).mockRejectedValue(fakeError);
      await expect(getAllCoffees(page, limit)).rejects.toThrow(
        "Database failure",
      );
    });
  });

  describe("getCoffeeById", () => {
    describe.each([
      {
        mockResult: fakeCoffee,
        inputId: fakeExistingCoffeeId,
        expected: fakeCoffee,
        label: "returns a coffee when data exists",
      },
      {
        mockResult: null,
        inputId: fakeNonExistingCoffeeId,
        expected: null,
        label: "returns null when data does not exist",
      },
    ])("$label", ({ mockResult, inputId, expected }) => {
      it("works correctly", async () => {
        // Set fake prisma.coffee output
        (prisma.coffee.findUnique as jest.Mock).mockResolvedValue(mockResult);
        // Call real service with fakes
        const result = await getCoffeeById(inputId);
        // Begin the test
        expect(prisma.coffee.findUnique).toHaveBeenCalledWith({
          where: { id: inputId },
        });
        expect(result).toEqual(expected);
      });
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
    describe.each([
      {
        input: fakeCreateCoffeeRequest,
        mockResult: fakeCoffee,
        expected: fakeCoffee,
        label: "creates a coffee and returns it",
      },
      {
        input: fakePartialCreateCoffeeRequest,
        mockResult: fakePartialCoffee,
        expected: fakePartialCoffee,
        label: "partial creates a coffee and returns it",
      },
    ])("$label", ({ input, mockResult, expected }) => {
      it("works correctly", async () => {
        // Set fake prisma.coffee output
        (prisma.coffee.create as jest.Mock).mockResolvedValue(mockResult);
        // Call real service with fakes
        const result = await createCoffee(input);
        // Begin the test
        expect(prisma.coffee.create).toHaveBeenCalledWith({
          data: input,
        });
        expect(result).toMatchObject(expected);
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
    describe.each([
      {
        label: "updates a coffee and returns it",
        input: fakeUpdateCoffeeRequest,
        mockResult: fakeUpdatedCoffee,
        expected: {
          id: fakeCoffee.id,
          name: fakeUpdatedCoffee.name,
          description: fakeCoffee.description,
          price: fakeUpdatedCoffee.price,
          createdAt: fakeCoffee.createdAt,
          updatedAt: fakeUpdatedCoffee.updatedAt,
        },
      },
      {
        label: "partial updates a coffee and returns it",
        input: fakePartialUpdateCoffeeRequest,
        mockResult: fakePartialUpdatedCoffee,
        expected: {
          id: fakeCoffee.id,
          name: fakePartialUpdateCoffeeRequest.name,
          description: fakeCoffee.description,
          price: fakeCoffee.price,
          createdAt: fakeCoffee.createdAt,
          updatedAt: fakePartialUpdatedCoffee.updatedAt,
        },
      },
    ])("$label", ({ input, mockResult, expected }) => {
      it("works correctly", async () => {
        // Set fake prisma.coffee output
        (prisma.coffee.update as jest.Mock).mockResolvedValue(mockResult);
        // Call real service with fakes
        const result = await updateCoffee(fakeExistingCoffeeId, input);
        // Begin the test
        expect(prisma.coffee.update).toHaveBeenCalledWith({
          data: input,
          where: { id: fakeExistingCoffeeId },
        });
        expect(result).toMatchObject(expected);
        expect(mockResult.updatedAt).toBeInstanceOf(Date);
        expect(mockResult.updatedAt.getTime()).toBeGreaterThan(
          fakeCoffee.updatedAt.getTime(),
        );
      });
    });

    it("throws an error if coffee does not exist when updating", async () => {
      (prisma.coffee.update as jest.Mock).mockRejectedValue(notFoundError);
      await expect(
        updateCoffee(fakeNonExistingCoffeeId, fakeUpdateCoffeeRequest),
      ).rejects.toThrow(expect.objectContaining({ code: "P2025" }));
    });

    it("throws an error if prisma.coffee.update fails", async () => {
      (prisma.coffee.update as jest.Mock).mockRejectedValue(fakeError);
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

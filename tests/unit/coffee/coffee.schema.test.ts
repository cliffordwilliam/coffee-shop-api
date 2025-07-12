import { z } from "zod";
import {
  CreateCoffeeSchema,
  UpdateCoffeeSchema,
  CoffeeSchema,
  ListCoffeesResponseSchema,
  CreateCoffeeResponseSchema,
  ViewCoffeeResponseSchema,
  UpdateCoffeeResponseSchema,
  DeleteCoffeeResponseSchema,
} from "@/modules/coffee/coffee.schema";
import { SuccessResponseSchema } from "@/modules/api/schema";
import { PaginationMeta } from "@/modules/common/common.schema";

describe("coffee.schema", () => {
  const validBase = {
    name: "Cappuccino",
    description: "Smooth and foamy",
    price: 4.5,
  };

  describe("CreateCoffeeSchema", () => {
    it("passes with valid input", () => {
      const parsed = CreateCoffeeSchema.parse(validBase);
      expect(parsed).toEqual(validBase);
    });

    it("fails if name is empty", () => {
      const result = CreateCoffeeSchema.safeParse({ ...validBase, name: "" });
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toMatch(/required/);
    });

    it("fails if price is negative", () => {
      const result = CreateCoffeeSchema.safeParse({ ...validBase, price: -10 });
      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toMatch(/positive/);
    });

    it("passes if description is omitted", () => {
      const { description, ...partial } = validBase;
      const parsed = CreateCoffeeSchema.parse(partial);
      expect(parsed).toEqual(partial);
    });
  });

  describe("UpdateCoffeeSchema", () => {
    it("allows partial update", () => {
      const result = UpdateCoffeeSchema.parse({ name: "Updated Name" });
      expect(result).toEqual({ name: "Updated Name" });
    });

    it("fails if price is negative", () => {
      const result = UpdateCoffeeSchema.safeParse({ price: -100 });
      expect(result.success).toBe(false);
    });

    it("passes if all fields omitted (valid empty patch)", () => {
      const result = UpdateCoffeeSchema.parse({});
      expect(result).toEqual({});
    });
  });

  describe("CoffeeSchema", () => {
    const coffee = {
      id: 1,
      name: "Latte",
      description: "Milky coffee",
      price: 3.0,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };

    it("passes with valid coffee object", () => {
      const parsed = CoffeeSchema.parse(coffee);
      expect(parsed).toEqual(coffee);
    });

    it("fails if id is missing", () => {
      const { id, ...withoutId } = coffee;
      const result = CoffeeSchema.safeParse(withoutId);
      expect(result.success).toBe(false);
    });
  });

  describe("Response Schemas", () => {
    const coffee = {
      id: 1,
      name: "Latte",
      description: "Milky coffee",
      price: 3.0,
      createdAt: new Date("2023-01-01T00:00:00Z"),
      updatedAt: new Date("2023-01-02T00:00:00Z"),
    };

    const response = {
      success: true,
      data: coffee,
    };

    it("validates CreateCoffeeResponseSchema", () => {
      const parsed = CreateCoffeeResponseSchema.parse(response);
      expect(parsed).toEqual(response);
    });

    it("validates UpdateCoffeeResponseSchema", () => {
      const parsed = UpdateCoffeeResponseSchema.parse(response);
      expect(parsed).toEqual(response);
    });

    it("validates ViewCoffeeResponseSchema", () => {
      const parsed = ViewCoffeeResponseSchema.parse(response);
      expect(parsed).toEqual(response);
    });

    it("validates DeleteCoffeeResponseSchema", () => {
      const parsed = DeleteCoffeeResponseSchema.parse(response);
      expect(parsed).toEqual(response);
    });

    it("validates ListCoffeesResponseSchema with multiple coffees and meta", () => {
      const parsed = ListCoffeesResponseSchema.parse({
        success: true,
        data: [coffee, coffee],
        meta: {
          pagination: {
            page: 1,
            size: 2,
            limit: 10,
            total: 2,
          },
        },
      });
      expect(parsed.data.length).toBe(2);
      const meta = parsed.meta as PaginationMeta;
      expect(meta.pagination.total).toBe(2);
    });

    it("validates ListCoffeesResponseSchema with empty array and meta", () => {
      const parsed = ListCoffeesResponseSchema.parse({
        success: true,
        data: [],
        meta: {
          pagination: {
            page: 1,
            size: 2,
            total: 0,
          },
        },
      });
      expect(parsed).toEqual({
        success: true,
        data: [],
        meta: {
          pagination: {
            page: 1,
            size: 2,
            total: 0,
          },
        },
      });
    });

    it("fails if success field is missing", () => {
      const result = CreateCoffeeResponseSchema.safeParse({ data: coffee });
      expect(result.success).toBe(false);
    });
  });

  describe("SuccessResponseSchema (with meta)", () => {
    it("validates success response with meta", () => {
      const MetaSchema = z.object({ count: z.number() });

      const schema = SuccessResponseSchema(z.array(CoffeeSchema), MetaSchema);

      const result = schema.parse({
        success: true,
        data: [],
        meta: { count: 0 },
      });

      expect(result).toEqual({
        success: true,
        data: [],
        meta: { count: 0 },
      });
    });
  });
});

import { PaginationMetaSchema } from "@/modules/common/common.schema";
import {
  IdParamSchema,
  PaginationQuerySchema,
} from "@/modules/common/common.schema";

describe("common.schema", () => {
  describe("PaginationMetaSchema", () => {
    it("passes with valid pagination object", () => {
      const valid = {
        pagination: {
          page: 1,
          size: 10,
          total: 20,
        },
      };

      const parsed = PaginationMetaSchema.parse(valid);
      expect(parsed).toEqual(valid);
    });

    it("fails if page is less than 1", () => {
      const result = PaginationMetaSchema.safeParse({
        pagination: {
          page: 0,
          size: 10,
          total: 5,
        },
      });

      expect(result.success).toBe(false);
    });

    it("fails if size is missing", () => {
      const result = PaginationMetaSchema.safeParse({
        pagination: {
          page: 1,
          total: 5,
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe("IdParamSchema", () => {
    it("parses valid id string to number", () => {
      const parsed = IdParamSchema.parse({ id: "5" });
      expect(parsed).toEqual({ id: 5 });
    });

    it("fails for non-numeric string", () => {
      const result = IdParamSchema.safeParse({ id: "abc" });
      expect(result.success).toBe(false);
    });

    it("fails for negative number", () => {
      const result = IdParamSchema.safeParse({ id: "-1" });
      expect(result.success).toBe(false);
    });
  });

  describe("PaginationQuerySchema", () => {
    it("parses default values if missing", () => {
      const parsed = PaginationQuerySchema.parse({});
      expect(parsed).toEqual({ page: 1, limit: 10 });
    });

    it("parses valid strings to numbers", () => {
      const parsed = PaginationQuerySchema.parse({ page: "2", limit: "5" });
      expect(parsed).toEqual({ page: 2, limit: 5 });
    });

    it("fails for invalid page", () => {
      const result = PaginationQuerySchema.safeParse({
        page: "abc",
        limit: "5",
      });
      expect(result.success).toBe(false);
    });

    it("fails for invalid limit", () => {
      const result = PaginationQuerySchema.safeParse({
        page: "1",
        limit: "NaN",
      });
      expect(result.success).toBe(false);
    });
  });
});

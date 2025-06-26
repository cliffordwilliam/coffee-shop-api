// src/utils/validateResponse.ts
import { ZodSchema, ZodError } from "zod";

export const validateResponse = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ZodError(result.error.errors);
  }
  return result.data;
};

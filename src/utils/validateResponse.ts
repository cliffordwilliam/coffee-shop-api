import { ZodSchema, ZodError } from "zod";

// To be used before sending data back to client
// Takes in Zod and data to be checked against it
// Throws error when data is invalid
// Returns data as is if valid (inferred with passed type shape)
export const validateResponse = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ZodError(result.error.errors);
  }
  return result.data;
};

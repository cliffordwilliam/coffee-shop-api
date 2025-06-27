import { z } from "zod";

// Request input payload (Zod + Type shape)
// Path Parameter (req.params)
export const IdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number),
});
export type IdParam = z.infer<typeof IdParamSchema>;
// Query String (req.query)
export const PaginationQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Page must be a number")
    .transform(Number)
    .optional()
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/, "Limit must be a number")
    .transform(Number)
    .optional()
    .default("10"),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

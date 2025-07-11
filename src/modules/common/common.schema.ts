import { z } from "zod";

// Request input payload (Zod + Type shape)
// Path Parameter (req.params)
export const IdParamSchema = z.object({
  id: z
    .string()
    .transform(Number)
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: "ID must be a positive integer",
    }),
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

// Response (Zod + Type shape)
// Pagination meta
export const PaginationMetaSchema = z.object({
  pagination: z.object({
    page: z.number().int().min(1),
    size: z.number().int().min(1),
    total: z.number().int().min(0),
  }),
});
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

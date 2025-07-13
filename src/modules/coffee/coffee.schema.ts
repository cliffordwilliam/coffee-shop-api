import { z } from "zod";
import { SuccessResponseSchema } from "@/modules/api/api.schema";
import { PaginationMetaSchema } from "../common/common.schema";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Turns zod to swag schema (zod defines whats being rendered on API doc page)
extendZodWithOpenApi(z);

// This file defines Zod and type shape of coffee requests and responses

// Base coffee Zod to avoid repetition in this file
// Used for input payload (POST, PUT, ...)
export const CoffeeBaseSchema = z.object({
  name: z.string().min(1, "Name is required").openapi({ example: "Espresso" }),
  description: z
    .string()
    .max(255)
    .optional()
    .openapi({ example: "Strong coffee" }),
  price: z
    .number()
    .positive("Price must be positive")
    .openapi({ example: 3.5 }),
});

// Full coffee Zod to avoid repetition in this file
// Used for response payload (GET, ...)
export const CoffeeSchema = CoffeeBaseSchema.extend({
  id: z.number().openapi({ example: 1 }),
  createdAt: z.date().openapi({ example: new Date().toISOString() }),
  updatedAt: z.date().openapi({ example: new Date().toISOString() }),
}).openapi("Coffee");

// Request input payload (Zod + Type shape)
// Create (req.body)
export const CreateCoffeeSchema = CoffeeBaseSchema.openapi("CreateCoffee");
export type CreateCoffeeRequest = z.infer<typeof CreateCoffeeSchema>;
// Update (req.body)
export const UpdateCoffeeSchema =
  CoffeeBaseSchema.partial().openapi("UpdateCoffee");
export type UpdateCoffeeRequest = z.infer<typeof UpdateCoffeeSchema>;

// Response (Zod + Type shape)
// Create
export const CreateCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type CreateCoffeeResponse = z.infer<typeof CreateCoffeeResponseSchema>;
// Update
export const UpdateCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type UpdateCoffeeResponse = z.infer<typeof UpdateCoffeeResponseSchema>;
// View
export const ViewCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type ViewCoffeeResponse = z.infer<typeof ViewCoffeeResponseSchema>;
// List
export const ListCoffeesResponseSchema = SuccessResponseSchema(
  z.array(CoffeeSchema),
  PaginationMetaSchema,
);
export type ListCoffeesResponse = z.infer<typeof ListCoffeesResponseSchema>;
// Delete
export const DeleteCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type DeleteCoffeeResponse = z.infer<typeof DeleteCoffeeResponseSchema>;

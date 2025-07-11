import { z } from "zod";
import { SuccessResponseSchema } from "@/modules/api/schema";
import { PaginationMetaSchema } from "../common/common.schema";

// This file defines Zod and type shape of coffee requests and responses

// Base coffee Zod to avoid repetition in this file
// Used for input payload (POST, PUT, ...)
export const CoffeeBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(255).optional(),
  price: z.number().positive("Price must be positive"),
});

// Full coffee Zod to avoid repetition in this file
// Used for response payload (GET, ...)
export const CoffeeSchema = CoffeeBaseSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Request input payload (Zod + Type shape)
// Create (req.body)
export const CreateCoffeeSchema = CoffeeBaseSchema;
export type CreateCoffeeRequest = z.infer<typeof CreateCoffeeSchema>;
// Update (req.body)
export const UpdateCoffeeSchema = CoffeeBaseSchema.partial();
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

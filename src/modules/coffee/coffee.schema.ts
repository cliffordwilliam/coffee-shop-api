// src/modules/coffee/coffee.model.ts
import { z } from "zod";
import { SuccessResponseSchema } from "@/modules/api/schema";

// Schema = Zod obj entity for validation
// Shape type = Strict typing

// Base schema for all coffee input (Zod obj entity)
// Used for input payload
export const CoffeeBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
});

// Full coffee object for responses (Zod obj entity + Shape Type)
// Used for response payload
export const CoffeeSchema = CoffeeBaseSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Coffee = z.infer<typeof CoffeeSchema>;

// Request body payload (Zod obj entity + Shape Type)
// Create
export const CreateCoffeeSchema = CoffeeBaseSchema;
export type CreateCoffeeRequest = z.infer<typeof CreateCoffeeSchema>;
// Update
export const UpdateCoffeeSchema = CoffeeBaseSchema.partial();
export type UpdateCoffeeRequest = z.infer<typeof UpdateCoffeeSchema>;

// Request param payload (Zod obj entity + Shape Type)
// Param query
export const CoffeeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number),
});
export type CoffeeIdParams = z.infer<typeof CoffeeIdParamSchema>;

// Response (Zod obj entity + Shape Type)
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
);
export type ListCoffeesResponse = z.infer<typeof ListCoffeesResponseSchema>;
// Delete
export const DeleteCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type DeleteCoffeeResponse = z.infer<typeof DeleteCoffeeResponseSchema>;

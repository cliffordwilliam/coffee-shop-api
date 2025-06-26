// src/modules/coffee/coffee.model.ts
import { z } from "zod";
import { SuccessResponseSchema } from "@/modules/api/schema";

// 1. Base schema for all coffee input (Zod obj entity)
export const CoffeeBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
});

// 2. Full coffee object for responses (Zod obj entity + Shape)
export const CoffeeSchema = CoffeeBaseSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Coffee = z.infer<typeof CoffeeSchema>;

// 3. Request DTOs (Zod obj entity + Shape)
export const CreateCoffeeSchema = CoffeeBaseSchema;
export type CreateCoffeeRequest = z.infer<typeof CreateCoffeeSchema>;

export const ViewCoffeeSchema = CoffeeBaseSchema;
export type ViewCoffeeRequest = z.infer<typeof ViewCoffeeSchema>;

export const UpdateCoffeeSchema = CoffeeBaseSchema.partial();
export type UpdateCoffeeRequest = z.infer<typeof UpdateCoffeeSchema>;

// 4. Response schemas using generic response wrapper (Zod obj entity + Shape)
export const UpdateCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type UpdateCoffeeResponse = z.infer<typeof UpdateCoffeeResponseSchema>;

export const CreateCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type CreateCoffeeResponse = z.infer<typeof CreateCoffeeResponseSchema>;

export const ViewCoffeeResponseSchema = SuccessResponseSchema(CoffeeSchema);
export type ViewCoffeeResponse = z.infer<typeof ViewCoffeeResponseSchema>;

export const ListCoffeesResponseSchema = SuccessResponseSchema(
  z.array(CoffeeSchema),
);
export type ListCoffeesResponse = z.infer<typeof ListCoffeesResponseSchema>;

// 5. Request Param query (Zod obj entity + Shape)
export const CoffeeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a positive integer")
    .transform(Number),
});
export type CoffeeIdParams = z.infer<typeof CoffeeIdParamSchema>;

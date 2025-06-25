import { z } from 'zod';

export const CreateCoffeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
});

export const UpdateCoffeeSchema = CreateCoffeeSchema.partial();

export type CreateCoffeeDTO = z.infer<typeof CreateCoffeeSchema>;
export type UpdateCoffeeDTO = z.infer<typeof UpdateCoffeeSchema>;

export interface Coffee {
  id: number;
  name: string;
  description?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

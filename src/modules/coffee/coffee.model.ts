// src/modules/coffee/coffee.model.ts

export interface Coffee {
  id: number;
  name: string;
  description?: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCoffeeDTO {
  name: string;
  description?: string;
  price: number;
}

export interface UpdateCoffeeDTO {
  name?: string;
  description?: string;
  price?: number;
}

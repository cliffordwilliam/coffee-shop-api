// src/modules/api/types.ts

// This file defines API error response and success response (Shapes + Zod obj entity)
import { z } from "zod";
import type { ErrorCodeValue } from "./errorCodes";

// This is my shape for error response
// Used for typing
export type ErrorResponse = {
  success: false; // Bool for easy to see that it failed
  error: {
    message: string; // Human-readable explanation of what went wrong (shown to client or logged, native JS Error prop).
    code?: ErrorCodeValue; // Optional. Meant for frontend logic, say if its type A then show toast.
    details?: unknown; // Optional. Meta of any shape, list, string, whatever, good for extra meta when needed ({field: name, message: ...}).
  };
};
// This is the Zod obj entity for error response
// Used for validation
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  }),
});

// This is my shape for success response
// Used for typing
export type SuccessResponse<T = unknown, M = Record<string, any>> = {
  success: true; // Bool for easy to see that it succeed
  data: T; // Whatever obj entity to be sent back
  meta?: M; // Whatever meta shape, list, string, good for extra meta (pagination)
};
// This is the Zod obj entity for success response
// Used for validation
export const SuccessResponseSchema = <
  T extends z.ZodTypeAny,
  M extends z.ZodTypeAny = z.ZodTypeAny,
>(
  data: T,
  meta?: M,
) =>
  z.object({
    success: z.literal(true),
    data,
    ...(meta ? { meta } : {}),
  });

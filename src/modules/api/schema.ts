// This file defines type shapes and zods for error res and success res

import { z } from "zod";
import type { ErrorCodeValue } from "./errorCodes";

// This is my type shape for error response
export type ErrorResponse = {
  success: false; // Bool for easy to see that it failed
  error: {
    message: string; // Human-readable explanation of what went wrong, native JS Error prop.
    code?: ErrorCodeValue; // Optional. Meant for frontend logic, say if its type "A" then show toast or something.
    details?: unknown; // Optional. Think of it like state transition extra meta message, say validation error ({field: name, message: name required}).
  };
};
// Error response Zod
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  }),
});

// This is my type shape for success response
export type SuccessResponse<T = unknown, M = Record<string, any>> = {
  success: true; // Bool for easy to see that it succeed
  data: T; // Whatever obj entity to be sent back, one coffee, list of coffees, ...
  meta?: M; // Optional. Think of it like state transition extra meta message, say pagination extra meta (limit, offset, ...)
};
// Success response Zod
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

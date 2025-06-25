// src/modules/api/types.ts

// This file defines API error response and success response shapes

import type { ErrorCodeValue } from './errorCodes';

// This is my shape for error response
export type ErrorResponse = {
  success: false;           // Bool for easy to see that it failed
  error: {
    message: string;        // Human-readable explanation of what went wrong (shown to client or logged, native JS Error prop).
    code?: ErrorCodeValue;  // Optional. Meant for frontend logic, say if its type A then show toast.
    details?: unknown;      // Optional. Meta of any shape, list, string, whatever, good for extra meta when needed ({field: name, message: ...}).
  };
};

// This is my shape for success response
export type SuccessResponse<T = unknown, M = Record<string, any>> = {
  success: true;    // Bool for easy to see that it succeed
  data: T;          // Whatever obj entity to be sent back
  meta?: M;         // Whatever meta shape, list, string, good for extra meta (pagination)
};

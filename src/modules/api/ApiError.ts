// src/errors/ApiError.ts
import type { ErrorCodeValue } from './errorCodes';

// Add extra props to native JS Error, this is my custom error obj entity representation
export class ApiError extends Error {
  // Define props type
  public statusCode: number;
  public code?: ErrorCodeValue;
  public details?: unknown;

  constructor(
    message: string,            // Human-readable explanation of what went wrong (shown to client or logged, native JS Error prop).
    statusCode = 500,           // HTTP response code to reflect the nature of the error (e.g., 404, 422, 500).
    code?: ErrorCodeValue,      // Optional. Meant for frontend logic, say if its type A then show toast.
    details?: unknown           // Optional. Meta of any shape, list, string, whatever, good for extra meta when needed ({field: name, message: ...}).
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Because Error is a native built-in class, subclassing it behaves weirdly in some JS runtimes
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

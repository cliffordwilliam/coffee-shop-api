import { HTTP_STATUS, HttpStatusValue } from "@/constants/http";
import type { ErrorCodeValue } from "./errorCodes";

// This file defines my error base class

// My error base class, inherit by error kids, app instance and throw error kids (404 not found, ...)
export class ApiError extends Error {
  // Define props shape type
  public statusCode: HttpStatusValue;
  public code?: ErrorCodeValue;
  public details?: unknown;

  constructor(
    message: string, // Human-readable explanation of what went wrong, native JS Error prop.
    statusCode: HttpStatusValue = HTTP_STATUS.INTERNAL_SERVER_ERROR, // HTTP response code (e.g., 404, 422, 500).
    code?: ErrorCodeValue, // Optional. Meant for frontend logic, say if its type "A" then show toast.
    details?: unknown, // Optional. Think of it like state transition extra meta message, say validation error ({field: name, message: name required}).
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Because parent is Error, a native built-in class, subclassing it behaves weirdly in some JS runtimes
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

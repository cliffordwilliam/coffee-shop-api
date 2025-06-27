import { ApiError } from "./ApiError";
import { ERROR_CODES } from "./errorCodes";

// My custom 404 error class
// Instance and throw it for any 404 in app errors
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

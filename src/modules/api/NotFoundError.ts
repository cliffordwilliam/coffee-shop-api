import { HTTP_STATUS } from "@/constants/http";
import { ApiError } from "./ApiError";
import { ERROR_CODES } from "./errorCodes";

// My custom 404 error class
// Instance and throw it for any 404 in app errors
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

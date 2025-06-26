// src/errors/NotFoundError.ts
import { ApiError } from "./ApiError";
import { ERROR_CODES } from "./errorCodes";

// My custom error obj entity representation on native JS Error, 404
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404, ERROR_CODES.RESOURCE_NOT_FOUND);
  }
}

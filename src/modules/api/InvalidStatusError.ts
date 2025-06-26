// src/errors/InvalidStatusError.ts
import { ApiError } from "./ApiError";
import { ERROR_CODES } from "./errorCodes";

// My custom error obj entity representation on native JS Error, 400
export class InvalidStatusError extends ApiError {
  constructor(message = "Invalid resource status") {
    super(message, 400, ERROR_CODES.INVALID_RESOURCE_STATUS);
  }
}

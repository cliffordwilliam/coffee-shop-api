import { HTTP_STATUS } from "@/constants/http";
import { ApiError } from "./ApiError";
import { ERROR_CODES } from "../../constants/errorCodes";

// My custom 400 error class
// Instance and throw it for any invalid business logic (e.g. patch to complete a cancelled order is not allowed)
export class InvalidStatusError extends ApiError {
  constructor(message = "Invalid resource status") {
    super(
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.INVALID_RESOURCE_STATUS,
    );
  }
}

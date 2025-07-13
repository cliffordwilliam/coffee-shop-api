import { ERROR_CODES } from "@/constants/errorCodes";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "@/modules/api/ApiError";
import {
  ErrorResponseSchema,
  type ErrorResponse,
} from "@/modules/api/api.schema";
import { validateResponse } from "@/utils/validateResponse";
import { HTTP_STATUS } from "@/constants/http";
import { logger } from "@/lib/logger";

// This file is the global error boundary

// Global error boundary
export function errorHandler(
  // All middleware needed passed parameters
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction, // Need this to satisfy express error middleware signature
) {
  // Catch any Zod error class instances thrown by app
  if (err instanceof ZodError) {
    // Make custom meta dict using Zod error class instance props
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      type: e.code,
    }));
    logger.warn("Zod validation error", {
      name: err.name,
      issues: details,
    });
    // Use custom meta dict to make my ErrorResponse type shape
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: "Request validation error",
        code: ERROR_CODES.VALIDATION_ERROR,
        details,
      },
    };
    // Validate it with ErrorResponse Zod before giving it to client
    const validErrorResponse = validateResponse(
      ErrorResponseSchema,
      errorResponse,
    );
    // Give it to client
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(validErrorResponse);
    // Quit early
    return;
  }

  // Catch any of my custom ApiError class instances thrown by app
  if (err instanceof ApiError) {
    logger.warn("ApiError caught", {
      name: err.name,
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      details: err.details,
    });
    // Use my custom ApiError class instance props to make my ErrorResponse shape
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
    };
    // Validate it with ErrorResponse Zod before giving it to client
    const validErrorResponse = validateResponse(
      ErrorResponseSchema,
      errorResponse,
    );
    // Give it to client
    res.status(err.statusCode).json(validErrorResponse);
    // Quit early
    return;
  }

  // Catch any unknown errors thrown by app
  logger.error("Unhandled server error", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });
  // Manually make my ErrorResponse shape here
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: "Internal Server Error",
      code: ERROR_CODES.INTERNAL_ERROR,
    },
  };
  // Validate it with ErrorResponse Zod before giving it to client
  const validErrorResponse = validateResponse(
    ErrorResponseSchema,
    errorResponse,
  );
  // Give it to client
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(validErrorResponse);
}

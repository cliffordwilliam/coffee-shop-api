// src/middlewares/errorHandler.ts
import { ERROR_CODES } from "@/modules/api/errorCodes";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "@/modules/api/ApiError";
import type { ErrorResponse } from "@/modules/api/schema";

// App level error catcher from whoever inside app that threw it
export function errorHandler(
  // All middleware needed passed parameters
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Catch error thrown by Zod (ZodError entity)
  if (err instanceof ZodError) {
    // Build custom meta using Zod error list
    const details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
      type: e.code,
    }));
    // Use custom meta obj to make my ErrorResponse shape
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: "Request validation error",
        code: ERROR_CODES.VALIDATION_ERROR,
        details,
      },
    };
    // Give it to client
    res.status(422).json(errorResponse);
  }

  // Catch error thrown by this app (ApiError entity)
  if (err instanceof ApiError) {
    // Use my custom ApiError entity obj to make my ErrorResponse shape
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        details: err.details,
      },
    };
    // Give it to client
    res.status(err.statusCode).json(errorResponse);
  }

  // Log unhandled errors thrown by unknown
  console.error(err);
  // Catch unhandled errors thrown by unknown
  // Make my ErrorResponse shape
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: "Internal Server Error",
      code: ERROR_CODES.INTERNAL_ERROR,
    },
  };
  // Give it to client
  res.status(500).json(errorResponse);
}

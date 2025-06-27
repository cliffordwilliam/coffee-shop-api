// This file defines my error codes tags used by other error classes

// Tags are useful for FE, if its tag "A" then show toasts...
export const ERROR_CODES = {
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  INVALID_RESOURCE_STATUS: "INVALID_RESOURCE_STATUS",
  DATABASE_OPERATION_FAILED: "DATABASE_OPERATION_FAILED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

// Type shapes for all possible error tags
export type ErrorCodeValue = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

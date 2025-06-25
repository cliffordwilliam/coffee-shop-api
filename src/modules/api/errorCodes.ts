// src/errors/errorCodes.ts

// All error code tags, good for FE to consume
export const ERROR_CODES = {
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INVALID_RESOURCE_STATUS: 'INVALID_RESOURCE_STATUS',
  DATABASE_OPERATION_FAILED: 'DATABASE_OPERATION_FAILED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;               // Autocompletion DX
export type ErrorCodeValue = (typeof ERROR_CODES)[ErrorCode];   // Validate shape

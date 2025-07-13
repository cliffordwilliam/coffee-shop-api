import { z } from "zod";

// This file defines http status codes for in app use and also swagger doc constants, to avoid spamming raw numbers everywhere

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const);

// Type shapes for all possible http status
export type HttpStatusValue = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

// Zod enum for Zod obj uses
export const HttpStatusEnum = z.nativeEnum(HTTP_STATUS);

// These are made for swagger doc
export const METHODS = {
  GET: "get",
  POST: "post",
  PATCH: "patch",
  DELETE: "delete",
} as const;

export const CONTENT = {
  JSON: "application/json",
} as const;

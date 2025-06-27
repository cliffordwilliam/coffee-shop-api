import { RequestHandler } from "express";
import { ZodError, z } from "zod";

// This file defines middleware to validate input payload

// Middleware to validate req.body
// Takes in any Zod obj type shape
// Takes in any body (req.body) type shape
// If invalid, throw Zod error class instance
// If valid, continue with inferred req body type shape
export const validateBody = <T extends z.ZodTypeAny>(
  schema: T,
): RequestHandler<{}, any, z.infer<T>> => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ZodError(result.error.errors));
    }
    req.body = result.data;
    next();
  };
};

// Middleware to validate req.params
// Takes in any Zod obj type shape
// Takes in any param query (req.params) type shape
// If invalid, throw Zod error class instance
// If valid, continue with inferred param query type shape
export const validateParams = <T extends z.ZodTypeAny>(
  schema: T,
): RequestHandler<z.infer<T>, any, any> => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new ZodError(result.error.errors));
    }
    req.params = result.data;
    next();
  };
};

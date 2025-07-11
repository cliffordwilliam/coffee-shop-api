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
): RequestHandler<unknown, unknown, z.infer<T>> => {
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
// Takes in any Path Parameter (req.params) type shape
// If invalid, throw Zod error class instance
// If valid, continue with inferred Path Parameter type shape
export const validateParams = <T extends z.ZodTypeAny>(
  schema: T,
): RequestHandler<z.infer<T>> => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return next(new ZodError(result.error.errors));
    }
    req.params = result.data;
    next();
  };
};

// Middleware to validate req.query
// Takes in any Zod obj type shape
// Takes in any Query String (req.query) type shape
// If invalid, throw Zod error class instance
// If valid, continue with inferred Query String type shape
export const validateQuery = <T extends z.ZodTypeAny>(
  schema: T,
): RequestHandler<unknown, unknown, unknown, z.infer<T>> => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new ZodError(result.error.errors));
    }
    req.query = result.data;
    next();
  };
};

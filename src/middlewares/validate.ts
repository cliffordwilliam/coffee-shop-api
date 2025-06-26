import { RequestHandler } from "express";
import { ZodError, z } from "zod";

// Middleware to validate and type shape req.body
// Takes in any Zod obj type shape
// Return explicit inferred body shape
// If invalid, throw my custom Zod error obj entity
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

// Middleware to validate and type shape req.params
// Takes in any Zod obj type shape
// Return explicit inferred param query shape
// If invalid, throw my custom Zod error obj entity
// If valid, continue with inferred param query type shape
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

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

// Express won't let me overwrite req or req.query
// So need to make a new type that adds a prop on top of req
// My custom prop to hold query stuff is in req.validatedQuery
export interface ValidatedRequest<TQuery> {
  validatedQuery: TQuery;
}

// Middleware to validate req.query
// Takes in any Zod obj type shape
// Takes in any Query String (req.query) type shape
// If invalid, throw Zod error class instance
// If valid, continue with inferred Query String type shape
export const validateQuery = <T extends z.ZodTypeAny>(
  schema: T,
): RequestHandler<unknown, unknown, unknown, unknown> => {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return next(new ZodError(result.error.errors));
    }
    // set to unknown first since its built in type is not exposed
    (req as unknown as ValidatedRequest<T>).validatedQuery = result.data;
    next();
  };
};

import { RequestHandler } from "express";
import { ZodError, z } from "zod";

// Generic middleware to validate and type req.body
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

// Generic middleware to validate and type req.params
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

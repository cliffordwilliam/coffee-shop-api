// src/middlewares/validate.ts

import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

// For codebase to use to validate req body payload input against zod obj dto
export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      // Throw this Zod error entity for global error handler
      return next(new ZodError(result.error.errors));
    }
    // Replace body with parsed (and possibly transformed) data
    req.body = result.data;
    next();
  };

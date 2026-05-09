import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });
  if (!result.success) {
    return res.status(400).json({ success: false, message: result.error.message, errors: result.error.errors });
  }
  req.body = result.data.body;
  req.params = result.data.params;
  req.query = result.data.query;
  next();
};

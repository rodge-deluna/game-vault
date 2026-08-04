import type { RequestHandler } from "express";
import { z } from "zod";

export function validateBody(schema: z.ZodType): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message:
                    result.error.issues[0]?.message ??
                    "Invalid request"
            });
        }

        req.body = result.data;
        next();
    };
}

export function validateQuery(schema: z.ZodType): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            return res.status(400).json({
                message:
                    result.error.issues[0]?.message ??
                    "Invalid request"
            });
        }

        res.locals.validatedQuery = result.data;
        next();
    };
}

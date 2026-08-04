import type { RequestHandler } from "express";
import { z } from "zod";

export function validate(schema: z.ZodType): RequestHandler {
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
import type { ErrorRequestHandler } from "express";
import { GameNotFoundError } from "../errors/GameNotFoundError.js";
import { ReviewNotFoundError } from "../errors/ReviewNotFoundError.js";

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (error instanceof GameNotFoundError ||
        error instanceof ReviewNotFoundError) {
        return res.status(404).json({
            message: error.message
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Internal Server Error"
    });
};
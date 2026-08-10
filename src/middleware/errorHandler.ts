import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { GameNotFoundError } from "../errors/GameNotFoundError.js";
import { ReviewNotFoundError } from "../errors/ReviewNotFoundError.js";
import { UserNotFoundError } from "../errors/UserNotFoundError.js";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import { ReviewForbiddenError } from "../errors/ReviewForbiddenError.js";

export const errorHandler: ErrorRequestHandler = (
    error,
    req,
    res,
    next
) => {
    if (error instanceof GameNotFoundError ||
        error instanceof ReviewNotFoundError ||
        error instanceof UserNotFoundError
    ) {
        return res.status(404).json({
            message: error.message
        });
    }

    if (error instanceof InvalidCredentialsError) {
        return res.status(401).json({
            message: error.message
        });
    }

    if(error instanceof ReviewForbiddenError) {
        return res.status(403).json({
            message: error.message
        });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return res.status(409).json({
            message: "Unique constraint failed"
        });
    }

    console.error(error);

    return res.status(500).json({
        message: "Internal Server Error"
    });
};
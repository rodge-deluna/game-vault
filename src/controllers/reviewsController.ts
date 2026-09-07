import type { Request, Response } from "express";
import * as reviewsService from "../services/reviewsService.js";
import type { GameIdNamedParams } from "../validators/gameValidator.js";
import type { ReviewIdParams } from "../validators/reviewValidator.js";

export async function createReview(req: Request, res: Response) {
    const { gameId } =
        res.locals.validatedParams as GameIdNamedParams;

    const userId = res.locals.userId;

    const newReview = await reviewsService.createReview(
        gameId,
        userId,
        req.body
    );

    return res.status(201).json(newReview);
}

export async function getReviewsByGameId(
    req: Request,
    res: Response
) {
    const { gameId } =
        res.locals.validatedParams as GameIdNamedParams;

    const reviews = await reviewsService.getReviewsByGameId(gameId);

    return res.status(200).json(reviews);
}

export async function getReviewById(req: Request, res: Response) {
    const { reviewId } =
        res.locals.validatedParams as ReviewIdParams;

    const review = await reviewsService.getReviewById(reviewId);

    return res.status(200).json(review);
}

export async function updateReview(req: Request, res: Response) {
    const { reviewId } =
        res.locals.validatedParams as ReviewIdParams;

    const userId = res.locals.userId;

    const updatedReview = await reviewsService.updateReview(
        reviewId,
        userId,
        req.body
    );

    return res.status(200).json(updatedReview);
}

export async function deleteReview(req: Request, res: Response) {
    const { reviewId } =
        res.locals.validatedParams as ReviewIdParams;

    const userId = res.locals.userId;

    await reviewsService.deleteReview(reviewId, userId);

    return res.status(204).send();
}
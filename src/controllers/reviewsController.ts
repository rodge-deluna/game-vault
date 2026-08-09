import type { Request, Response } from "express";
import * as reviewsService from "../services/reviewsService.js";


export async function createReview(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);
    if (Number.isNaN(gameId)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const userId = res.locals.userId;

    const newReview = await reviewsService.createReview(gameId, userId, req.body);

    return res.status(201).json(newReview);
}

export async function getReviewsByGameId(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);
    if (Number.isNaN(gameId)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const reviews = await reviewsService.getReviewsByGameId(gameId);

    return res.status(200).json(reviews);
}

export async function getReviewById(req: Request, res: Response) {
    const reviewId = Number(req.params.reviewId);
    if (Number.isNaN(reviewId)) {
        return res.status(400).json({
            message: "Invalid review ID"
        });
    }

    const review = await reviewsService.getReviewById(reviewId);

    return res.status(200).json(review);
}

export async function updateReview(req: Request, res: Response) {
    const reviewId = Number(req.params.reviewId);

    if (Number.isNaN(reviewId)) {
        return res.status(400).json({
            message: "Invalid review ID"
        });
    }

    const updatedReview = await reviewsService.updateReview(
        reviewId,
        req.body
    );

    return res.status(200).json(updatedReview);
}

export async function deleteReview(req: Request, res: Response) {
    const reviewId = Number(req.params.reviewId);

    if (Number.isNaN(reviewId)) {
        return res.status(400).json({
            message: "Invalid review ID"
        });
    }

    await reviewsService.deleteReview(reviewId);

    return res.status(204).send();
}
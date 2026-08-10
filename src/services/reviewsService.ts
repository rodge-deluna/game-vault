import prisma from "../db/prisma.js";
import type { CreateReviewInput } from "../validators/reviewValidator.js";
import * as gamesService from "../services/gamesService.js";
import { ReviewNotFoundError } from "../errors/ReviewNotFoundError.js";
import { ReviewForbiddenError } from "../errors/ReviewForbiddenError.js";

export async function createReview(
    gameId: number,
    userId: number,
    data: CreateReviewInput
) {
    await gamesService.getGameById(gameId);

    return prisma.review.create({
        data: {
            ...data,
            gameId,
            userId
        }
    });
}

export async function getReviewsByGameId(gameId: number) {
    await gamesService.getGameById(gameId);

    return prisma.review.findMany({
        where: { gameId }
    });
}

export async function getReviewById(reviewId: number) {
    const review = await prisma.review.findUnique({
        where: { id: reviewId }
    });

    if (!review) {
        throw new ReviewNotFoundError();
    }

    return review;
}

export async function updateReview(reviewId: number, userId: number, data: CreateReviewInput) {
    const review = await getReviewById(reviewId);

    if (review.userId !== userId) {
        throw new ReviewForbiddenError();
    }

    return prisma.review.update({
        where: { id: reviewId },
        data
    });
}

export async function deleteReview(reviewId: number, userId: number) {
    const review = await getReviewById(reviewId);

    if (review.userId !== userId) {
        throw new ReviewForbiddenError();
    }

    return prisma.review.delete({
        where: { id: reviewId }
    });
}
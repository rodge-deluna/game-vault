import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../db/prisma.js";
import { createTestUserAndLogin } from "./helpers/auth.js";

describe("Reviews", () => {
    let tokenA: string;
    let tokenB: string;
    let userAId: number;
    let userBId: number;
    let gameId: number;

    beforeEach(async () => {
        await prisma.review.deleteMany();
        await prisma.backlog.deleteMany();
        await prisma.game.deleteMany();
        await prisma.user.deleteMany();

        const userA = await createTestUserAndLogin({
            username: "userA",
            email: "userA@example.com",
            password: "password123"
        });

        const userB = await createTestUserAndLogin({
            username: "userB",
            email: "userB@example.com",
            password: "password123"
        });

        tokenA = userA.token;
        tokenB = userB.token;
        userAId = userA.user.id;
        userBId = userB.user.id;

        const game = await prisma.game.create({
            data: {
                title: "Elden Ring",
                genre: "Action RPG"
            }
        });

        gameId = game.id;
    });

    it("allows an authenticated user to create a review", async () => {
        const response = await request(app)
            .post(`/games/${gameId}/reviews`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 5,
                comment: "Amazing game"
            });

        expect(response.status).toBe(201);
        expect(response.body.rating).toBe(5);
        expect(response.body.comment).toBe("Amazing game");
        expect(response.body.userId).toBe(userAId);
    });

    it("rejects review creation without authentication", async () => {
        const response = await request(app)
            .post(`/games/${gameId}/reviews`)
            .send({
                rating: 4,
                comment: "Should not be created"
            });

        expect(response.status).toBe(401);
    });

    it("prevents the same user from reviewing the same game twice", async () => {
        await request(app)
            .post(`/games/${gameId}/reviews`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 5,
                comment: "First review"
            });

        const response = await request(app)
            .post(`/games/${gameId}/reviews`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 4,
                comment: "Second review"
            });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe(
            "You have already reviewed this game"
        );
    });

    it("allows the owner to update their review", async () => {
        const review = await prisma.review.create({
            data: {
                rating: 4,
                comment: "Original review",
                gameId,
                userId: userAId
            }
        });

        const response = await request(app)
            .put(`/reviews/${review.id}`)
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 5,
                comment: "Updated review"
            });

        expect(response.status).toBe(200);
        expect(response.body.rating).toBe(5);
        expect(response.body.comment).toBe("Updated review");
    });

    it("prevents another user from updating the review", async () => {
        const review = await prisma.review.create({
            data: {
                rating: 4,
                comment: "Original review",
                gameId,
                userId: userAId
            }
        });

        const response = await request(app)
            .put(`/reviews/${review.id}`)
            .set("Authorization", `Bearer ${tokenB}`)
            .send({
                rating: 1,
                comment: "Trying to overwrite it"
            });

        expect(response.status).toBe(403);

        const unchangedReview = await prisma.review.findUnique({
            where: {
                id: review.id
            }
        });

        expect(unchangedReview?.rating).toBe(4);
        expect(unchangedReview?.comment).toBe("Original review");
    });

    it("allows the owner to delete their review", async () => {
        const review = await prisma.review.create({
            data: {
                rating: 4,
                comment: "Delete me",
                gameId,
                userId: userAId
            }
        });

        const response = await request(app)
            .delete(`/reviews/${review.id}`)
            .set("Authorization", `Bearer ${tokenA}`);

        expect(response.status).toBe(204);

        const deletedReview = await prisma.review.findUnique({
            where: {
                id: review.id
            }
        });

        expect(deletedReview).toBeNull();
    });

    it("prevents another user from deleting the review", async () => {
        const review = await prisma.review.create({
            data: {
                rating: 4,
                comment: "Do not delete",
                gameId,
                userId: userAId
            }
        });

        const response = await request(app)
            .delete(`/reviews/${review.id}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(response.status).toBe(403);

        const existingReview = await prisma.review.findUnique({
            where: {
                id: review.id
            }
        });

        expect(existingReview).not.toBeNull();
    });

    it("returns 404 when updating a nonexistent review", async () => {
        const response = await request(app)
            .put("/reviews/999999")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 5,
                comment: "Does not exist"
            });

        expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid review ID on update", async () => {
        const response = await request(app)
            .put("/reviews/invalid")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                rating: 5,
                comment: "Invalid ID"
            });

        expect(response.status).toBe(400);
    });

    it("returns 404 when deleting a nonexistent review", async () => {
        const response = await request(app)
            .delete("/reviews/999999")
            .set("Authorization", `Bearer ${tokenA}`);

        expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid review ID on delete", async () => {
        const response = await request(app)
            .delete("/reviews/invalid")
            .set("Authorization", `Bearer ${tokenA}`);

        expect(response.status).toBe(400);
    });
});
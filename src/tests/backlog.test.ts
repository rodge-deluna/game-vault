import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../db/prisma.js";
import { createTestUserAndLogin } from "./helpers/auth.js";

describe("Backlog", () => {
    let token: string;
    let userId: number;
    let gameId: number;

    beforeEach(async () => {
        await prisma.backlog.deleteMany();
        await prisma.review.deleteMany();
        await prisma.game.deleteMany();
        await prisma.user.deleteMany();

        const testUser = await createTestUserAndLogin({
            username: "testuser",
            email: "test@example.com",
            password: "password123"
        });

        token = testUser.token;
        userId = testUser.user.id;

        const game = await prisma.game.create({
            data: {
                title: "Elden Ring",
                genre: "Action RPG"
            }
        });

        gameId = game.id;
    });

    it("adds a game to the backlog", async () => {
        const response = await request(app)
            .post(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(201);
        expect(response.body.gameId).toBe(gameId);
        expect(response.body.userId).toBe(userId);
        expect(response.body.status).toBe("WISHLIST");

        const backlog = await prisma.backlog.findUnique({
            where: {
                backlog_user_unique: {
                    gameId,
                    userId
                }
            }
        });

        expect(backlog).not.toBeNull();
    });

    it("prevents adding the same game twice", async () => {
        await request(app)
            .post(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`);

        const response = await request(app)
            .post(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(409);
    });

    it("returns the authenticated user's backlog", async () => {
        await prisma.backlog.create({
            data: {
                gameId,
                userId
            }
        });

        const response = await request(app)
            .get("/users/me/backlog")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].gameId).toBe(gameId);
        expect(response.body[0].game.title).toBe("Elden Ring");
    });

    it("updates a backlog status", async () => {
        await prisma.backlog.create({
            data: {
                gameId,
                userId
            }
        });

        const response = await request(app)
            .patch(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                status: "PLAYING"
            });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe("PLAYING");

        const backlog = await prisma.backlog.findUnique({
            where: {
                backlog_user_unique: {
                    gameId,
                    userId
                }
            }
        });

        expect(backlog?.status).toBe("PLAYING");
    });

    it("rejects an invalid backlog status", async () => {
        await prisma.backlog.create({
            data: {
                gameId,
                userId
            }
        });

        const response = await request(app)
            .patch(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                status: "FINISHED"
            });

        expect(response.status).toBe(400);
    });

    it("removes a game from the backlog", async () => {
        await prisma.backlog.create({
            data: {
                gameId,
                userId
            }
        });

        const response = await request(app)
            .delete(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);

        const backlog = await prisma.backlog.findUnique({
            where: {
                backlog_user_unique: {
                    gameId,
                    userId
                }
            }
        });

        expect(backlog).toBeNull();
    });

    it("returns 404 when removing a game not in the backlog", async () => {
        const response = await request(app)
            .delete(`/games/${gameId}/backlog`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it("rejects backlog creation without authentication", async () => {
        const response = await request(app)
            .post(`/games/${gameId}/backlog`);

        expect(response.status).toBe(401);
    });

    it("rejects backlog status updates without authentication", async () => {
        const response = await request(app)
            .patch(`/games/${gameId}/backlog`)
            .send({
                status: "PLAYING"
            });

        expect(response.status).toBe(401);
    });

    it("rejects backlog deletion without authentication", async () => {
        const response = await request(app)
            .delete(`/games/${gameId}/backlog`);

        expect(response.status).toBe(401);
    });

    it("rejects viewing the backlog without authentication", async () => {
        const response = await request(app)
            .get("/users/me/backlog");

        expect(response.status).toBe(401);
    });
});
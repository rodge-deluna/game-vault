import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../db/prisma.js";


describe("POST /auth/login", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();

        await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });
    });

    it("rejects an incorrect password", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe("test@example.com");
        expect(response.body.token).toBeDefined();
        expect(response.body.user.password).toBeUndefined();
    });

    it("rejects a nonexistent user", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "wrongpassword"
            });

        expect(response.status).toBe(401);
        expect(response.body.token).toBeUndefined();
        expect(response.body.message).toBe("Invalid email or password")

    });

    it("logs in with no user", async () => {
        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "nobody@example.com",
                password: "password123"
            });

        expect(response.status).toBe(401);
        expect(response.body.token).toBeUndefined();
        expect(response.body.message).toBe("Invalid email or password")
    });
});


describe("authentication middleware", () => {
    let token: string;

    beforeEach(async () => {
        await prisma.user.deleteMany();

        await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        token = response.body.token;
    });

    it("rejects requests without a token", async () => {
        const response = await request(app)
            .get("/users/me/reviews");

        expect(response.status).toBe(401);
    });

    it("accepts a valid token", async () => {
        const response = await request(app)
            .get("/users/me/reviews").set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("rejects an invalid token", async () => {
        const response = await request(app)
            .get("/users/me/reviews").set("Authorization", "Bearer fake token");

        expect(response.status).toBe(401);
    });
});
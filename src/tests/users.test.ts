import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../db/prisma.js";

describe("POST /users", () => {
    beforeEach(async () => {
        await prisma.user.deleteMany();
    });

    it("creates a user", async () => {
        const response = await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.status).toBe(201);
        expect(response.body.username).toBe("testuser");
        expect(response.body.email).toBe("test@example.com");
        expect(response.body.password).toBeUndefined();

        const user = await prisma.user.findUnique({
            where: {
                email: "test@example.com"
            }
        });

        expect(user).not.toBeNull();
        expect(user?.password).not.toBe("password123");
    });
});

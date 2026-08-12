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


describe("PUT /users/me", () => {
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

    it("let user update their credentials", async () => {
        const response = await request(app)
            .put("/users/me").send({
                username: "updateduser",
                email: "updated@example.com",
                password: "newpassword123"
            }).set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.email).toBe("updated@example.com");

        const updatedUser = await prisma.user.findUnique({
            where: {
                email: "updated@example.com"
            }
        });

        expect(updatedUser).not.toBeNull();
        expect(updatedUser?.username).toBe("updateduser");
        expect(updatedUser?.password).not.toBe("newpassword123");
    })

    it("prevents unauthorized updates", async () => {
        const response = await request(app)
            .put("/users/me")
            .send({
                username: "updateduser",
                email: "updated@example.com",
                password: "newpassword123"
            });

        expect(response.status).toBe(401);

        const user = await prisma.user.findUnique({
            where: {
                email: "test@example.com"
            }
        });

        expect(user).not.toBeNull();
        expect(user?.email).toBe("test@example.com");
    });
})

describe("DELETE /users/me", () => {
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

    it("let user delete their account", async () => {
        const response = await request(app)
            .delete("/users/me").set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(204);

        const deletedUser = await prisma.user.findUnique({
            where: {
                email: "test@example.com"
            }
        });

        expect(deletedUser).toBeNull();
    })

    it("prevents unauthorized deletion", async () => {
        const response = await request(app)
            .delete("/users/me")

        expect(response.status).toBe(401);

        const user = await prisma.user.findUnique({
            where: {
                email: "test@example.com"
            }
        });

        expect(user).not.toBeNull();
    })
})
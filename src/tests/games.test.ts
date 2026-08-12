import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import prisma from "../db/prisma.js";
import { title } from "node:process";

describe("GET /games", () => {
    beforeEach(async () => {
        await prisma.game.deleteMany();

        await prisma.game.createMany({
            data: [
                {
                    title: "Elden Ring",
                    genre: "Action RPG"
                },
                {
                    title: "Hades",
                    genre: "Roguelike"
                },
                {
                    title: "Elden Ring Nightreign",
                    genre: "Action RPG"
                }
            ]
        });
    })

    it("returns all games", async () => {
        const response = await request(app).get("/games")

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(3);
    })

    it("returns filtered games", async () => {
        const response = await request(app).get("/games").query({
            search: "elden"
        });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2);
        const titles = response.body.data.map((game: any) => game.title);
        expect(titles).toContain("Elden Ring");
        expect(titles).toContain("Elden Ring Nightreign");
        expect(titles).not.toContain("Hades");
    })

    it("returns games sorted by title ascending", async () => {
        const response = await request(app)
            .get("/games")
            .query({
                sort: "title",
                order: "asc"
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(3);

        const titles = response.body.data.map((game: any) => game.title);

        expect(titles).toEqual([
            "Elden Ring",
            "Elden Ring Nightreign",
            "Hades"
        ]);
    });

    it("returns games sorted by title descending", async () => {
        const response = await request(app)
            .get("/games")
            .query({
                sort: "title",
                order: "desc"
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(3);

        const titles = response.body.data.map((game: any) => game.title);

        expect(titles).toEqual([
            "Hades",
            "Elden Ring Nightreign",
            "Elden Ring"
        ]);
    });

    it("returns the first page of games", async () => {
        const response = await request(app)
            .get("/games")
            .query({
                page: 1,
                limit: 2
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.pagination).toEqual({
            page: 1,
            limit: 2,
            total: 3,
            totalPages: 2
        });
    });

    it("returns the first page of games", async () => {
        const response = await request(app)
            .get("/games")
            .query({
                page: 1,
                limit: 2
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2);

        expect(response.body.pagination).toEqual({
            page: 1,
            limit: 2,
            total: 3,
            totalPages: 2
        });
    });

    it("returns the second page of games", async () => {
        const response = await request(app)
            .get("/games")
            .query({
                page: 2,
                limit: 2
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1);

        expect(response.body.pagination).toEqual({
            page: 2,
            limit: 2,
            total: 3,
            totalPages: 2
        });
    });
})

describe("GET /games/:id", () => {
    beforeEach(async () => {
        await prisma.game.deleteMany();
    });

    it("returns a game by ID", async () => {
        const game = await prisma.game.create({
            data: {
                title: "Elden Ring",
                genre: "Action RPG"
            }
        });

        const response = await request(app)
            .get(`/games/${game.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(game.id);
        expect(response.body.title).toBe("Elden Ring");
        expect(response.body.genre).toBe("Action RPG");
    });

    it("returns 404 when game does not exist", async () => {
        const response = await request(app)
            .get("/games/999999");

        expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid game ID", async () => {
        const response = await request(app)
            .get("/games/invalid");

        expect(response.status).toBe(400);
    });
});

describe("POST /games", () => {
    let token: string;

    beforeEach(async () => {
        await prisma.game.deleteMany();
        await prisma.user.deleteMany();

        await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        token = loginResponse.body.token;
    });

    it("creates a game", async () => {
        const response = await request(app)
            .post("/games")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Sekiro",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe("Sekiro");
        expect(response.body.genre).toBe("Action Adventure");

        const game = await prisma.game.findUnique({
            where: {
                id: response.body.id
            }
        });

        expect(game).not.toBeNull();
        expect(game?.title).toBe("Sekiro");
    });

    it("rejects an empty title", async () => {
        const response = await request(app)
            .post("/games")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "",
                genre: "Action"
            });

        expect(response.status).toBe(400);
    });

    it("prevents unauthorized game creation", async () => {
        const response = await request(app)
            .post("/games")
            .send({
                title: "Sekiro",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(401);
    });
});

describe("PUT /games/:id", () => {
    let token: string;

    beforeEach(async () => {
        await prisma.game.deleteMany();
        await prisma.user.deleteMany();

        await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        token = loginResponse.body.token;
    });

    it("updates a game", async () => {
        const game = await prisma.game.create({
            data: {
                title: "Sekiro",
                genre: "Action Adventure"
            }
        });

        const response = await request(app)
            .put(`/games/${game.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Sekiro: Shadows Die Twice",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Sekiro: Shadows Die Twice");

        const updatedGame = await prisma.game.findUnique({
            where: {
                id: game.id
            }
        });

        expect(updatedGame).not.toBeNull();
        expect(updatedGame?.title).toBe("Sekiro: Shadows Die Twice");
    });

    it("returns 404 when updating a nonexistent game", async () => {
        const response = await request(app)
            .put("/games/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Sekiro",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid game ID", async () => {
        const response = await request(app)
            .put("/games/invalid")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Sekiro",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(400);
    });

    it("prevents unauthorized game updates", async () => {
        const game = await prisma.game.create({
            data: {
                title: "Sekiro",
                genre: "Action Adventure"
            }
        });

        const response = await request(app)
            .put(`/games/${game.id}`)
            .send({
                title: "Updated",
                genre: "Action Adventure"
            });

        expect(response.status).toBe(401);

        const unchangedGame = await prisma.game.findUnique({
            where: {
                id: game.id
            }
        });

        expect(unchangedGame?.title).toBe("Sekiro");
    });
});

describe("DELETE /games/:id", () => {
    let token: string;

    beforeEach(async () => {
        await prisma.game.deleteMany();
        await prisma.user.deleteMany();

        await request(app)
            .post("/users")
            .send({
                username: "testuser",
                email: "test@example.com",
                password: "password123"
            });

        const loginResponse = await request(app)
            .post("/auth/login")
            .send({
                email: "test@example.com",
                password: "password123"
            });

        token = loginResponse.body.token;
    });

    it("deletes a game", async () => {
        const game = await prisma.game.create({
            data: {
                title: "Sekiro",
                genre: "Action Adventure"
            }
        });

        const response = await request(app)
            .delete(`/games/${game.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(204);

        const deletedGame = await prisma.game.findUnique({
            where: {
                id: game.id
            }
        });

        expect(deletedGame).toBeNull();
    });

    it("returns 404 when deleting a nonexistent game", async () => {
        const response = await request(app)
            .delete("/games/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
    });

    it("returns 400 for an invalid game ID", async () => {
        const response = await request(app)
            .delete("/games/invalid")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(400);
    });

    it("prevents unauthorized game deletion", async () => {
        const game = await prisma.game.create({
            data: {
                title: "Sekiro",
                genre: "Action Adventure"
            }
        });

        const response = await request(app)
            .delete(`/games/${game.id}`);

        expect(response.status).toBe(401);

        const existingGame = await prisma.game.findUnique({
            where: {
                id: game.id
            }
        });

        expect(existingGame).not.toBeNull();
    });
});

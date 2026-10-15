import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("External Games", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should search for games from RAWG", async () => {
        vi.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({
                results: [
                    {
                        id: 326243,
                        name: "Elden Ring",
                        released: "2022-02-25",
                        background_image: "elden-ring.jpg",
                        rating: 4.38,
                        genres: [
                            { name: "Action" },
                            { name: "RPG" }
                        ],
                        platforms: [
                            {
                                platform: {
                                    name: "PC"
                                }
                            }
                        ]
                    }
                ]
            })
        } as Response);

        const response = await request(app)
            .get("/external-games?search=elden%20ring");

        expect(response.status).toBe(200);

        expect(response.body).toEqual([
            {
                externalId: 326243,
                title: "Elden Ring",
                releaseDate: "2022-02-25",
                backgroundImage: "elden-ring.jpg",
                rating: 4.38,
                genres: ["Action", "RPG"],
                platforms: ["PC"]
            }
        ]);
    });
});
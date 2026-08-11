import request from "supertest";
import { describe, it, expect } from "vitest";
import app from "../app.js";

describe("test environment", () => {
    it("uses the test database", () => {
        expect(process.env.DATABASE_URL).toContain("gamevault_test");
    });
});
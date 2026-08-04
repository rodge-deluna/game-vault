import { z } from "zod";

export const createGameSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
import { z } from "zod";

export const createGameSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required"),
    genre: z.string().trim().min(1, "Genre cannot be empty").optional(),
});

export const getGamesQuerySchema = z
    .object({
        search: z.string().optional(),
        sort: z.enum(["title", "id"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10)
    })
    .refine(
        (data) => data.order === undefined || data.sort !== undefined,
        {
            message: "The 'order' parameter requires a 'sort' parameter",
            path: ["order"]
        }
    );

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type GetGamesQuery = z.infer<typeof getGamesQuerySchema>;

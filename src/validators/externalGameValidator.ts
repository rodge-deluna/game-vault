import { z } from "zod";

export const searchGamesQuerySchema = z.object({
    search: z
        .string()
        .trim()
        .min(1, "Search is required")
});

export const externalGameIdParamSchema = z.object({
    externalId: z.coerce
        .number()
        .int()
        .positive("Invalid external game ID")
});

export type ExternalGameIdParams =
    z.infer<typeof externalGameIdParamSchema>;

export type SearchGamesQuery =
    z.infer<typeof searchGamesQuerySchema>;
import { z } from "zod";

export const statusSchema = z.object({
    status: z.enum(["WISHLIST",
        "PLAYING",
        "COMPLETED",
        "DROPPED"])
});

export type StatusInput = z.infer<typeof statusSchema>;
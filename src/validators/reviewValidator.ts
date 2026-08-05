import { z } from "zod";

export const createReviewSchema = z.object({
    rating: z.number()
        .min(0.5, "Rating must be at least 0.5")
        .max(5, "Rating cannot exceed 5")
        .refine(
            (rating) => Number.isInteger(rating * 2),
            {
                message: "Rating must be in 0.5 increments"
            }
        ),
    comment: z.string().trim().min(1, "Comment cannot be empty").optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
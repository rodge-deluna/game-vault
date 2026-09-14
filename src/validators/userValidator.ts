import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const userIdParamSchema = z.object({
    userId: z.coerce
        .number()
        .int()
        .positive("Invalid user ID")
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamSchema>;

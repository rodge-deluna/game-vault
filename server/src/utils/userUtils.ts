import type { User } from "@prisma/client";

export function removePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
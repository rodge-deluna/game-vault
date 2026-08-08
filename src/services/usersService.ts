import prisma from "../db/prisma.js";
import type { CreateUserInput } from "../validators/userValidator.js";
import { UserNotFoundError } from "../errors/UserNotFoundError.js";

export async function createUser(data: CreateUserInput) {
    return prisma.user.create({
        data
    });
}

export async function getUserById(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new UserNotFoundError();
    }

    return user;
}

export async function getUsers() {
    return prisma.user.findMany();
}

export async function updateUser(userId: number, data: CreateUserInput) {
    await getUserById(userId);

    return prisma.user.update({
        where: { id: userId },
        data
    });
}

export async function deleteUser(userId: number) {
    await getUserById(userId);

    return prisma.user.delete({
        where: { id: userId }
    });
}

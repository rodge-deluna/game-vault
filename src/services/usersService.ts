import prisma from "../db/prisma.js";
import type { CreateUserInput } from "../validators/userValidator.js";
import { UserNotFoundError } from "../errors/UserNotFoundError.js";
import bcryptjs from "bcryptjs";
import type { User } from "@prisma/client";

function removePassword(user: User) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function createUser(data: CreateUserInput) {
    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        }
    });

    return removePassword(user);
}

export async function getUserById(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        throw new UserNotFoundError();
    }

    return removePassword(user);
}

export async function getUsers() {
    const users = await prisma.user.findMany();

    return users.map(removePassword);
}

export async function updateUser(userId: number, data: CreateUserInput) {
    await getUserById(userId);

    const hashedPassword = await bcryptjs.hash(data.password, 10);

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            ...data,
            password: hashedPassword
        }
    });

    return removePassword(user);
}

export async function deleteUser(userId: number) {
    await getUserById(userId);

    return prisma.user.delete({
        where: { id: userId }
    });
}

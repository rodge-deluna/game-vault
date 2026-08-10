import prisma from "../db/prisma.js";
import { BacklogAlreadyExistsError, BacklogNotFoundError } from "../errors/backlogError.js";
import { getGameById } from "./gamesService.js";
import { Prisma } from "@prisma/client";

export async function addToBacklog(gameId: number, userId: number) {
    await getGameById(gameId);

    try {
        return await prisma.backlog.create({
            data: {
                gameId,
                userId
            }
        })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw new BacklogAlreadyExistsError();
        }
        throw err;
    }

}

export async function getMyBacklogs(userId: number) {
    return prisma.backlog.findMany({
        where: {
            userId
        },
        include: {
            game: true
        }
    })
}

export async function deleteBacklog(gameId: number, userId: number) {
    try {
        return await prisma.backlog.delete({
            where: {
                backlog_user_unique: {
                    gameId,
                    userId
                }
            }
        })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            throw new BacklogNotFoundError()
        }
        throw err;
    }
}
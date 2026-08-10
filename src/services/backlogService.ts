import prisma from "../db/prisma.js";
import { BacklogAlreadyExistsError } from "../errors/backlogError.js";
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

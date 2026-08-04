import type { Prisma } from "@prisma/client";
import prisma from "../db/prisma.js";
import { GameNotFoundError } from "../errors/GameNotFoundError.js";
import type { CreateGameInput } from "../validators/gameValidator.js";

export async function getGameById(id: number) {
    const game = await prisma.game.findUnique({
        where: { id }
    });

    if (!game) {
        throw new GameNotFoundError();
    }

    return game;
}

export async function createGame({ title }: CreateGameInput) {
    return prisma.game.create({
        data: {
            title
        }
    });
}

export async function getGames(search?: string, sort?: string, order?: string) {
    const query: Prisma.GameFindManyArgs = {};

    if (search !== undefined) {
        query.where = {
            title: {
                contains: search.trim(),
                mode: "insensitive"
            }
        };
    }

    if (sort !== undefined) {
        query.orderBy = {
            [sort]: order ?? "asc"
        };
    }

    return prisma.game.findMany(query);
}

export async function updateGame(id: number, title: string) {
    await getGameById(id);

    return prisma.game.update({
        where: { id },
        data: { title }
    });
}

export async function deleteGame(id: number) {
    await getGameById(id);

    return prisma.game.delete({
        where: {
            id
        }
    });
}
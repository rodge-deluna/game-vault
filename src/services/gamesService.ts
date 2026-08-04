import type { Prisma } from "@prisma/client";
import prisma from "../db/prisma.js";
import { GameNotFoundError } from "../errors/GameNotFoundError.js";
import type { CreateGameInput, GetGamesQuery } from "../validators/gameValidator.js";


export async function getGameById(id: number) {
    const game = await prisma.game.findUnique({
        where: { id }
    });

    if (!game) {
        throw new GameNotFoundError();
    }

    return game;
}

export async function createGame(data: CreateGameInput) {
    return prisma.game.create({
        data
    });
}

export async function getGames({
    search,
    sort,
    order,
    page,
    limit
}: GetGamesQuery) {
    const query: Prisma.GameFindManyArgs = {};
    const skip = (page - 1) * limit;

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

    query.skip = skip;
    query.take = limit;

    const games = await prisma.game.findMany(query);

    const total = await prisma.game.count({
        where: query.where
    });

    return {
        data: games,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function updateGame(id: number, data: CreateGameInput) {
    await getGameById(id);

    return prisma.game.update({
        where: { id },
        data
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
import type { Prisma } from "@prisma/client";
import prisma from "../db/prisma.js";

export async function getGameById(id: number) {
    return prisma.game.findUnique({
        where: {
            id
        }
    });
}

export async function createGame(title: string) {
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
    return prisma.game.update({
        where: {
            id
        },
        data: {
            title
        }
    });
}

export async function deleteGame(id: number) {
    return prisma.game.delete({
        where: {
            id
        }
    });
}
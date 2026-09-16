import type { Request, Response } from "express";
import * as gamesService from "../services/gamesService.js";
import * as rawgService from "../services/rawgService.js";
import type { ExternalGameIdParams, SearchGamesQuery } from "../validators/externalGameValidator.js";

export async function searchGames(req: Request, res: Response) {
    const { search } =
        res.locals.validatedQuery as SearchGamesQuery;

    const games = await rawgService.searchGames(search);

    return res.status(200).json(games);
}

export async function importGame(req: Request, res: Response) {
    const { externalId } =
        res.locals.validatedParams as ExternalGameIdParams;

    const game = await gamesService.importGame(externalId);

    return res.status(201).json(game);
}
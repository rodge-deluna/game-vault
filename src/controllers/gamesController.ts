import type { Request, Response } from "express";
import * as gamesService from "../services/gamesService.js";
import type { GetGamesQuery, GameIdParams } from "../validators/gameValidator.js";

export async function getGames(req: Request, res: Response) {
    const query = res.locals.validatedQuery as GetGamesQuery;

    const result = await gamesService.getGames(query);

    return res.status(200).json(result);
}

export async function getGameById(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as GameIdParams;

    const game = await gamesService.getGameById(id);

    return res.status(200).json(game);
}

export async function createGame(req: Request, res: Response) {
    const newGame = await gamesService.createGame(req.body);

    return res.status(201).json(newGame);
}

export async function updateGame(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as GameIdParams;

    const updatedGame = await gamesService.updateGame(id, req.body);

    return res.status(200).json(updatedGame);
}

export async function deleteGame(req: Request, res: Response) {
    const { id } = res.locals.validatedParams as GameIdParams;

    await gamesService.deleteGame(id);

    return res.status(204).send();
}
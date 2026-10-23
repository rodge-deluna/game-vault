import type { Request, Response } from "express";
import * as backlogService from "../services/backlogService.js";
import type { GameIdNamedParams } from "../validators/gameValidator.js";

export async function createBacklog(req: Request, res: Response) {
    const { gameId } =
        res.locals.validatedParams as GameIdNamedParams;

    const userId = res.locals.userId;

    const result = await backlogService.addToBacklog(gameId, userId);

    return res.status(201).json(result);
}

export async function getMyBacklogs(req: Request, res: Response) {
    const userId = res.locals.userId;

    const result = await backlogService.getMyBacklogs(userId);

    return res.status(200).json(result);
}

export async function deleteBacklog(req: Request, res: Response) {
    const { gameId } =
        res.locals.validatedParams as GameIdNamedParams;

    const userId = res.locals.userId;

    await backlogService.deleteBacklog(gameId, userId);

    return res.status(204).send();
}

export async function updateBacklogStatus(
    req: Request,
    res: Response
) {
    const { gameId } =
        res.locals.validatedParams as GameIdNamedParams;

    const userId = res.locals.userId;

    const updatedBacklog =
        await backlogService.updateBacklogStatus(
            gameId,
            userId,
            req.body
        );

    return res.status(200).json(updatedBacklog);
}
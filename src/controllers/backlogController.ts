import type { Request, Response } from "express";
import * as backlogService from "../services/backlogService.js";

export async function createBacklog(req: Request, res: Response) {
    const gameId = Number(req.params.gameId);

    if (Number.isNaN(gameId)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

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
    const gameId = Number(req.params.gameId);

    if (Number.isNaN(gameId)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const userId = res.locals.userId;

    await backlogService.deleteBacklog(gameId, userId);

    return res.status(204).send();
}
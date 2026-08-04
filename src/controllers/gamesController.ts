import type { Request, Response } from "express";
import * as gamesService from "../services/gamesService.js";

type ValidationResult =
    | {
        success: true;
        value: string;
    }
    | {
        success: false;
        error: string;
    };

function validateTitle(title: unknown): ValidationResult {
    if (typeof title !== "string") {
        return {
            success: false,
            error: "Title must be a string"
        };
    }

    const sanitizedTitle = title.trim();

    if (sanitizedTitle.length === 0) {
        return {
            success: false,
            error: "Title cannot be empty"
        };
    }

    return {
        success: true,
        value: sanitizedTitle
    };
}

export async function getGames(req: Request, res: Response) {
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    // Validate query parameters
    if (search !== undefined && typeof search !== "string") {
        return res.status(400).json({
            message: "Search must be a string"
        });
    }

    if (sort !== undefined && typeof sort !== "string") {
        return res.status(400).json({
            message: "Sort must be a string"
        });
    }

    if (order !== undefined && typeof order !== "string") {
        return res.status(400).json({
            message: "Order must be a string"
        });
    }

    // Validate sort and order parameters
    if (order !== undefined && sort === undefined) {
        return res.status(400).json({
            message: "The 'order' parameter requires a 'sort' parameter"
        });
    }

    if (sort !== undefined && sort !== "title" && sort !== "id") {
        return res.status(400).json({
            message: "Sort must be either 'title' or 'id'"
        });
    }

    if (order !== undefined && order !== "asc" && order !== "desc") {
        return res.status(400).json({
            message: "Order must be either 'asc' or 'desc'"
        });
    }

    const games = await gamesService.getGames(search, sort, order);

    return res.status(200).json(games);
}

export async function getGameById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const game = await gamesService.getGameById(id);

    return res.status(200).json(game);
}

export async function createGame(req: Request, res: Response) {
    const newGame = await gamesService.createGame(req.body);

    return res.status(201).json(newGame);
}

export async function updateGame(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const updatedGame = await gamesService.updateGame(id, req.body.title);

    return res.status(200).json(updatedGame);
}

export async function deleteGame(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    await gamesService.deleteGame(id);

    return res.status(204).send();
}
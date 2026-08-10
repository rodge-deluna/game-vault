import type { Request, Response } from "express";
import * as usersService from "../services/usersService.js";

export async function createUser(req: Request, res: Response) {
    const newUser = await usersService.createUser(req.body);

    return res.status(201).json(newUser);
}

export async function getUserById(req: Request, res: Response) {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const user = await usersService.getUserById(id);

    return res.status(200).json(user);
}

export async function getUsers(req: Request, res: Response) {
    const users = await usersService.getUsers();

    return res.status(200).json(users);
}

export async function getMyReviews(req: Request, res: Response) {
    const userId = res.locals.userId;

    const reviews = await usersService.getMyReviews(userId);

    return res.status(200).json(reviews);
}

export async function updateUser(req: Request, res: Response) {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    const user = await usersService.updateUser(id, req.body);

    return res.status(200).json(user);
}

export async function deleteUser(req: Request, res: Response) {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid user ID"
        });
    }

    await usersService.deleteUser(id);

    return res.status(204).send();
}

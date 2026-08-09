import type { Request, Response } from "express";
import * as authService from "../services/authService.js";

export async function login(req: Request, res: Response) {
    const user = await authService.loginUser(req.body);

    return res.status(200).json(user);
}
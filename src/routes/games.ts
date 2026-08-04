import { Router } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gamesController.js";
import { createGameSchema, getGamesQuerySchema } from "../validators/gameValidator.js";
import {
    validateBody,
    validateQuery
} from "../middleware/validate.js";

const router = Router();

router.get("/", validateQuery(getGamesQuerySchema), getGames);

router.get("/:id", getGameById);

router.post("/", validateBody(createGameSchema), createGame);

router.put("/:id", validateBody(createGameSchema), updateGame);

router.delete("/:id", deleteGame);

export default router;
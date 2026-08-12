import { Router } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gamesController.js";
import { createGameSchema, getGamesQuerySchema } from "../validators/gameValidator.js";
import {
    validateBody,
    validateQuery
} from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", validateQuery(getGamesQuerySchema), getGames);

router.get("/:id", getGameById);

router.post("/", authenticate, validateBody(createGameSchema), createGame);

router.put("/:id", authenticate, validateBody(createGameSchema), updateGame);

router.delete("/:id", authenticate, deleteGame);

export default router;
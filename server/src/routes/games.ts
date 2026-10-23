import { Router } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gamesController.js";
import { createGameSchema, getGamesQuerySchema, gameIdParamSchema } from "../validators/gameValidator.js";
import {
    validateBody,
    validateQuery,
    validateParams
} from "../middleware/validate.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", validateQuery(getGamesQuerySchema), getGames);

router.get("/:id", validateParams(gameIdParamSchema), getGameById);

router.post("/", authenticate, validateBody(createGameSchema), createGame);

router.put("/:id", authenticate, validateParams(gameIdParamSchema), validateBody(createGameSchema), updateGame);

router.delete("/:id", authenticate, validateParams(gameIdParamSchema), deleteGame);

export default router;
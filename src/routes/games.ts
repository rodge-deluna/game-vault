import { Router } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "../controllers/gamesController.js";
import { createGameSchema } from "../validators/gameValidator.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", getGames);

router.get("/:id", getGameById);

router.post("/", validate(createGameSchema), createGame);

router.put("/:id", validate(createGameSchema), updateGame);

router.delete("/:id", deleteGame);

export default router;
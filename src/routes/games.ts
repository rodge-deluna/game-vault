import { Router } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame} from "../controllers/gamesController.js";

const router = Router();

router.get("/", getGames);

router.get("/:id", getGameById);

router.post("/", createGame);

router.put("/:id", updateGame);

router.delete("/:id", deleteGame);

export default router;
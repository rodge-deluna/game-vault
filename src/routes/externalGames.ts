import { Router } from "express";
import { importGame, searchGames } from "../controllers/externalGamesController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateParams, validateQuery } from "../middleware/validate.js";
import { externalGameIdParamSchema, searchGamesQuerySchema } from "../validators/externalGameValidator.js";

const router = Router();

router.get("/", validateQuery(searchGamesQuerySchema), searchGames);

router.post("/:externalId/import", authenticate, validateParams(externalGameIdParamSchema), importGame);

export default router;
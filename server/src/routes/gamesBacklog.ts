import { Router } from "express";
import { createBacklog, deleteBacklog, updateBacklogStatus } from "../controllers/backlogController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { gameIdNamedParamSchema } from "../validators/gameValidator.js";
import { statusSchema } from "../validators/statusValidator.js";

const router = Router();

router.post("/:gameId/backlog", authenticate, validateParams(gameIdNamedParamSchema), createBacklog);

router.delete("/:gameId/backlog", authenticate, validateParams(gameIdNamedParamSchema), deleteBacklog);

router.patch("/:gameId/backlog", authenticate, validateParams(gameIdNamedParamSchema), validateBody(statusSchema), updateBacklogStatus);

export default router;
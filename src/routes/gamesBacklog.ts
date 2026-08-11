import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createBacklog, deleteBacklog, updateBacklogStatus } from "../controllers/backlogController.js";
import { validateBody } from "../middleware/validate.js";
import { statusSchema } from "../validators/statusValidator.js";

const router = Router();

router.post("/:gameId/backlog", authenticate, createBacklog);

router.delete("/:gameId/backlog", authenticate, deleteBacklog);

router.patch("/:gameId/backlog", authenticate, validateBody(statusSchema), updateBacklogStatus)

export default router;
import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createBacklog, deleteBacklog } from "../controllers/backlogController.js";

const router = Router();

router.post("/:gameId/backlog", authenticate, createBacklog);

router.delete("/:gameId/backlog", authenticate, deleteBacklog);

export default router;
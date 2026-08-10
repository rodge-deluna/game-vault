import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { createBacklog } from "../controllers/backlogController.js";

const router = Router();

router.post("/:gameId/backlog", authenticate, createBacklog);

export default router;
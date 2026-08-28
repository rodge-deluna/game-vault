import { Router } from "express";
import { getMyBacklogs } from "../controllers/backlogController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/backlog", authenticate, getMyBacklogs);

export default router;
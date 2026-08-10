import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getMyBacklogs } from "../controllers/backlogController.js";

const router = Router();

router.get("/backlog", authenticate, getMyBacklogs);

export default router;
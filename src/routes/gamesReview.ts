import { Router } from "express";
import { createReview, getReviewsByGameId } from "../controllers/reviewsController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/reviewValidator.js";


const router = Router();

router.post("/:gameId/reviews", authenticate, validateBody(createReviewSchema), createReview);

router.get("/:gameId/reviews", getReviewsByGameId);

export default router;
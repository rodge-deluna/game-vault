import { Router } from "express";
import { createReview, getReviewsByGameId } from "../controllers/reviewsController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { gameIdNamedParamSchema } from "../validators/gameValidator.js";
import { createReviewSchema } from "../validators/reviewValidator.js";


const router = Router();

router.post("/:gameId/reviews", authenticate, validateParams(gameIdNamedParamSchema), validateBody(createReviewSchema), createReview);

router.get("/:gameId/reviews", validateParams(gameIdNamedParamSchema), getReviewsByGameId);

export default router;
import { Router } from "express";
import { createReview, getReviewsByGameId } from "../controllers/reviewsController.js";
import { createReviewSchema } from "../validators/reviewValidator.js";
import { validateBody } from "../middleware/validate.js";


const router = Router();

router.post("/:gameId/reviews", validateBody(createReviewSchema), createReview);

router.get("/:gameId/reviews", getReviewsByGameId);


export default router;